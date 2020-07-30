const Category = require("../models/Category")
const Product = require("../models/Product")
const File = require("../models/File")
const { formatPrice, dateFormatted } = require("../../lib/utils")

module.exports = {
    add(req, res) {

        // promise
        Category.select()
        .then(function(results) {
            return res.render('products/create.njk', { categories: results.rows })
        }).catch(function(err) {
            throw new Error(err)
        })

    },

    async post(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (key == "removedImage") {
                continue
            }
            if (!req.body[key]) return res.send("Please fill in all fields!")
        }

        if (req.files.length == 0 ) 
            return res.send("Please, send at least 1 image!")

        req.body.user_id = req.session.userId
        const results = await Product.add(req.body)
        const product_id = results.rows[0].id

        // Creating an array with promises to be capable to use await with array.
        const filesPromise = req.files.map(file => File.create({...file, product_id}))

        await Promise.all(filesPromise)

        return res.redirect(`products/${product_id}`)
    },

    async show(req, res) {
        const { id } = req.params

        let results = await Product.find(id)
        const product = results.rows[0]

        if (!product) return res.send("Product not found!")

        product.updated_at = dateFormatted(product.updated_at).brasil

        const discounts = {
            inUsd: formatPrice((product.price - product.old_price)),
            inPercent: Math.round((100*(1 - product.price/product.old_price)))
        } 
        product.price = formatPrice(product.price)
        product.old_price = formatPrice(product.old_price)

        // get files
        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render('products/show', { product, discounts, files })
    },

    async edit(req, res) {
        const { id } = req.params

        results = await Product.find(id)
        const product = results.rows[0]

        if(!product) return res.send("Product not found!")

        product.price = formatPrice(product.price)
        product.old_price = formatPrice(product.old_price)

        // get categories
        results = await Category.select()
        const categories = results.rows

        // get files
        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))


        return res.render('products/edit.njk', { product, categories, files })
    },
    
    async update(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key!="removedImage")
                 return res.send("Please, fill in all fields!")
        }

        if (req.body.removedImage) {
            const removedImages = req.body.removedImage.split(",")
            const lastIndex = removedImages.length - 1
            removedImages.splice(lastIndex, 1)

            const idImagesToRemovePromise = removedImages.map(imageId => File.delete(imageId))
            await Promise.all(idImagesToRemovePromise)
        }

        req.body.price = req.body.price.replace(/\D/g, "")
        req.body.old_price = req.body.old_price.replace(/\D/g, "")

        const results = await Product.update(req.body)
        const product_id = results.rows[0].id

        // if a new image was uploaded
        if (req.files.length != 0) {
            const filesPromise = req.files.map(file => File.create({...file, product_id}))

            await Promise.all(filesPromise)
        }

        return res.redirect(`/products/${req.body.id}`)
    },

    async delete(req, res){
        const { id } = req.body
        await Product.delete(id)

        return res.redirect('/')
    }
}