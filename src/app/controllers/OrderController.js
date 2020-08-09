const User = require("../models/User")
const Order = require("../models/Order")

const LoadProductService = require("../services/LoadProductService")
const LoadOrderService = require("../services/LoadOrderService")

const mailer = require("../../lib/mailer")
const Cart = require("../../lib/cart")

module.exports = {
    async index(req, res) {
        const orders = await LoadOrderService.load("orders", {where: {buyer_id: req.session.userId}})

        return res.render("orders/index", { orders })
    },
    async post(req, res) {
        try {

            const cart = Cart.init(req.session.cart)

            const buyer_id = req.session.userId
            const filteredItems = cart.items.filter(item => {
                return item.product.user_id != buyer_id
            })

            const createdOrdersPromise = filteredItems.map(async item => {
                let { product, price:total, quantity } = item
                const {price, id:product_id, user_id:seller_id, } = product
                const status = "open"

                const order = await Order.add({
                    seller_id,
                    buyer_id,
                    product_id,
                    price,
                    quantity,
                    total,
                    status
                })

                product = await LoadProductService.load("product", {where: {
                    id: product_id
                }})

                console.log(product)

                const buyer = await User.find(buyer_id)
                const seller = await User.find(seller_id)

                await mailer.sendMail({
                    to: 'sportstore@sportstore.com',
                    from: 'noreply@sportstore.com',
                    subject: `You got a new buyer - ${buyer.name}`,
                    html: `<h2>New buyer</h2>
                    <p>HI ${seller.name}, please send the product: ${product.name}
                    to <b>${buyer.address}</b></p>
                    <p>Sport Store Corporation ® </p>
                    `
                })

                return order
            })

            await Promise.all(createdOrdersPromise)

            delete req.session.cart
            Cart.init()

            return res.render("orders/success")

        } catch(err) {
            console.error(err)
            return res.render("orders/error")
        }
    },
    async sales(req, res) {
        const sales = await LoadOrderService.load("orders", {where: {seller_id: req.session.userId}})

        return res.render("orders/sales", { sales })
    },
    
    async show(req, res) {
        const { id } = req.params

        try {
            const order = await LoadOrderService.load("order", {where: {id}})
            return res.render("orders/details", { order })
        } catch(err) {
            return res.render("orders/index", {
                error: `Impossible to find an order with id: ${id}`
            })
        }
    },
    async close(req, res) {
        try {
            const order = await LoadOrderService.load("order", {where: {id: req.params.id}})
            const status = "sold"
    
            await Order.update(req.params.id, {status})
    
            return res.redirect("/orders/sales")
        } catch(err) {
            console.error(err)
            return res.render("/orders/sales", {
                error: "Error cancelling this order. Try again later!"
            })
        }
    },
    async cancel(req, res) {
        try {
            const order = await LoadOrderService.load("order", {where: {id: req.params.id}})
            const status = "canceled"
    
            await Order.update(req.params.id, {status})
    
            return res.redirect("/orders/sales")
        } catch(err) {
            console.error(err)
            return res.render("/orders/sales", {
                error: "Error cancelling this order. Try again later!"
            })
        }
    }

}