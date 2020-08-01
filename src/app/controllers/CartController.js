const Cart = require("../../lib/cart")
const LoadService = require("../services/LoadProductService")

module.exports = {
    async index(req, res) {
        try {
            let { cart } = req.session
            cart = Cart.init(cart)

            return res.render("cart/index", { cart })
        } catch(err) {
            console.error(err)
        }
    },
    async addOne(req, res) {
        try {
            const { id } = req.params
            const product = await LoadService.load("product", {where: {id}})

            let { cart } = req.session
    
            req.session.cart = Cart.init(cart).addOne(product)

            return res.redirect("/cart")
        } catch (err) {
            console.error(err)
        }
    },
    deleteOne(req, res) {
        try {
            const { id } = req.params

            let { cart } = req.session

            if(!cart) return res.redirect("/cart")
    
            req.session.cart = Cart.init(cart).deleteOne(id)

            return res.redirect("/cart")
        } catch (err) {
            console.error(err)
        }
    },
    deleteAll(req, res) {
        try {
            const { id } = req.params

            let { cart } = req.session

            if(!cart) return res.redirect("/cart")
    
            req.session.cart  = Cart.init(cart).deleteAll(id)

            return res.redirect("/cart")
        } catch (err) {
            console.error(err)
        }
    },
}