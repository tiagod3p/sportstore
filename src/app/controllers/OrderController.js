const LoadService  = require("../services/LoadProductService")
const User = require("../models/User")

const mailer = require("../../lib/mailer")

module.exports = {
    async post(req, res) {
        try {
            const customer = await User.find(req.session.userId)

            await mailer.sendMail({
                to: 'sportstore@sportstore.com',
                from: 'noreply@sportstore.com',
                subject: `You got a new customer - ${customer.name}`,
                html: `<h2>New customer</h2>
                <p>Please send the products to <b>${customer.address}</b></p>
                <p>Sport Store Corporation ® </p>
                `
            })

            console.log(req.session.cart.total.price)

            return res.render("orders/success")

        } catch(err) {
            console.error(err)
            return res.render("orders/error")
        }
    }
}