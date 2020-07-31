const Product = require("../models/Product")
const LoadService = require("../services/LoadProductService")

module.exports = {
    async index(req, res) {

        try {
            let products,
                params = {}
            
            const { filter, category } = req.query

            if (!filter) return res.redirect("/")

            params.filter = filter

            if (category) params.category = category

            products = await Product.search(params)

            if (!products) return res.send(`"${filter} didn't return any result! :/"`)

            products = products.map(LoadService.format)
            products = products.filter((product, index) => index > 5 ? false : true)
            products = await Promise.all(products)

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