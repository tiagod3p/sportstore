const Product = require("../models/Product")
const { formatPrice } = require("../../lib/utils")

module.exports = {
    async index(req, res) {

        try {
            let results,
                products,
                params = {}
            
            const { filter, category } = req.query

            if (!filter) return res.redirect("/")

            params.filter = filter

            if (category) params.category = category

            results = await Product.search(params)
            products = results.rows

            if (!products) return res.send(`"${filter} didn't return any result! :/"`)

            async function getImage(productId) {
                // This function get the files of the products and
                // returns one file src of each product.
                let results = await Product.files(productId)
                if (!results.rows[0]) return
    
                const file = results.rows[0]
                return `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }
    
            // an array of promises to keep the products
            const productsPromise = products.map(async product => {
               product.image = await getImage(product.id)
               product.price = formatPrice(product.price)
               product.old_price = formatPrice(product.old_price)
               return product
            }).filter((product, index) => index > 2 ? false : true)

            
            products = await Promise.all(productsPromise)

            const search = {
                term: filter,
                total: products.length
            }

            let categories = products.map(product => ({
                id: product.category_id,
                name: product.category_name
            }))

            categories = categories.reduce( (categoriesFiltered, category) => {

                const found = categoriesFiltered.some(cat => cat.id == category.id)

                if (!found) {
                    categoriesFiltered.push(category)
                }

                return categoriesFiltered

            }, [])
    
            return res.render("search/index", { products, search, categories})

        } catch(err) {
            console.log(err)
        }
    }
    
}