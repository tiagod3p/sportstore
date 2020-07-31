const LoadService  = require("../services/LoadProductService")

module.exports = {
    async index(req, res) {
        
        const allProducts = await LoadService.load("products")

        const products = allProducts
        .filter((product, index) => index > 5 ? false : true)

        return res.render("home/index", { products })
    }
}