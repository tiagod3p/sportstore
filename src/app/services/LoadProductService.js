const Product = require("../models/Product")
const { formatPrice, dateFormatted } = require("../../lib/utils")
const { errorMonitor } = require("nodemailer/lib/mailer")

async function getImages(productId) {
    // This function get the files of the products and
    // returns one file src of each product.
    let files = await Product.files(productId)
    
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
    }))

    return files
}

async function format(product) {

    const files = await getImages(product.id)

    product.image = files[0].src
    product.files = files
    product.formattedOldPrice = formatPrice(product.old_price)
    product.formattedPrice = formatPrice(product.price)
    product.created_at = dateFormatted(product.created_at).brasil
    product.updated_at = dateFormatted(product.updated_at).brasil
    product.discountInUsd =  formatPrice((product.price - product.old_price))
    product.discountInPercentage = Math.round((100*(1 - product.price/product.old_price)))
   
    return product
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    async product() {
        try {
            const product = await Product.findOne(this.filter)
            return format(product)

        } catch (err) {
            console.error(err)
        }
    },
    async products() {
        try {
            const products = await Product.findAll(this.filter)
            const productsPromise = products.map(format) // -> products.map(product => format(product))
            return Promise.all(productsPromise)

        } catch (err) {
            console.error(err)
        }
    },
    format
}

module.exports = LoadService