const Product = require("../models/Product")
const { formatPrice } = require("../../lib/utils")

module.exports = {
    async index(req, res) {
        let results = await Product.select()
        let products = results.rows

        if (!products) return res.send("We don't have any product yet!")

        async function getImage(productId) {
            // This function get the files of the products and
            // returns one file src of each product.
            let results = await Product.files(productId)

            if (!results.rows[0]) return

            const file = results.rows[0]
            return `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }

        // an array of promises to keep the products
        // and filtering to send only 3 products to the homepage
        const productsPromise = products.map(async product => {
           product.image = await getImage(product.id)
           product.price = formatPrice(product.price)
           product.old_price = formatPrice(product.old_price)
           return product
        }).filter((product, index) => index > 6 ? false : true)

        products = await Promise.all(productsPromise)
        
        return res.render("home/index", { products })
    }
}