const { unlinkSync } = require('fs')

const Category = require("../models/Category")
const Product = require("../models/Product")
const File = require("../models/File")
const { formatPrice, dateFormatted } = require("../../lib/utils")

const LoadService = require("../services/LoadProductService")

module.exports = {
    async add(req, res) {
        try {
            const categories = await Category.findAll()
            return res.render('products/create.njk', { categories })
        } catch(err) {
            console.error(err)
        }
    },

    async post(req, res) {
        try {
            let { category_id, name, description, price, quantity } = req.body

            user_id = req.session.userId
            price = price.replace(/\D/g, "")
            old_price = price
            status = 1

            const product_id = await Product.add({
                category_id,
                user_id,
                name,
                description,
                old_price,
                price,
                quantity,
                status
            })
    
            // Creating an array with promises to be capable to use await with array.
            const filesPromise = req.files.map(file => File.add(
                { 
                    name: file.filename,
                    path: file.path,
                    product_id}
                ))

            await Promise.all(filesPromise)

            return res.redirect(`products/${product_id}`)
        } catch(err) {
            console.error(err)
            return res.redirect("/products/add")
        }
    },

    async show(req, res) {
        try {
            const { id } = req.params

            const product = await LoadService.load("product", {where: {id}})
            
            if (!product) return res.send("Product not found!")

            return res.render('products/show', { product })
        } catch(err) {
            console.error(err)
            return res.redirect("/")
        }
    },

    async edit(req, res) {
        try {
            const { id } = req.params

            const product = await LoadService.load("product", {where: {id}})
            
            if (!product) return res.send("Product not found!")

            // get categories
            const categories = await Category.findAll()

            return res.render('products/edit.njk', { product, categories })
        } catch(err) {
            console.error(err)
            return res.redirect(`/products/${product.id}`)
        }
    },
    
    async update(req, res) {
        try {
            if (req.body.removedImage) {
                const removedImages = req.body.removedImage.split(",")
                const lastIndex = removedImages.length - 1
                removedImages.splice(lastIndex, 1)
    
                const idImagesToRemovePromise = removedImages.map(imageId => File.delete(imageId))
                await Promise.all(idImagesToRemovePromise)
            }

            let { category_id, name,
                 description, old_price, price, quantity, status } = req.body

            price = price.replace(/\D/g, "")
            old_price = old_price.replace(/\D/g, "")
    
            const product_id = await Product.update(req.body.id, {
                category_id,
                name,
                description,
                old_price,
                price,
                quantity,
                status
            })
    
            // if a new image was uploaded
            if (req.files.length != 0) {
                const filesPromise = req.files.map(file => File.create({
                    name: file.filename,
                    path: file.path, 
                    product_id}))
                await Promise.all(filesPromise)
            }
    
            return res.redirect(`/products/${product_id}`)
        } catch(err) {
            console.error(err)
            return res.render('products/show', { error: "An error ocurred, please try again."})
        }
    },

    async delete(req, res){
        const { id } = req.body

        const files = await Product.files(id)

        await Product.delete(id)

        files.map(file => unlinkSync(file.path))

        return res.redirect('/')
    }
}