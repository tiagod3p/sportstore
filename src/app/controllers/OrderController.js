const LoadService  = require("../services/LoadProductService")
const User = require("../models/User")

const mailer = require("../../lib/mailer")

module.exports = {
    async post(req, res) {
        try {
            const { id } = req.body
            const product = await LoadService.load("product", { where: {id} })

            const seller = await User.find(product.user_id)

            const customer = await User.find(req.session.userId)

            await mailer.sendMail({
                to: seller.email,
                from: 'noreply@sportstore.com',
                subject: `You got a new customer - ${customer.name}`,
                html: `<h2>New customer</h2>
                <p>Please send the product: <b>${product.name}</b> to <b>${customer.address}</b></p>
                <p>Do not share this link with anyone</p>
                `
            })

            return res.render("orders/error")

        } catch(err) {
            console.error(err)
            return res.render("orders/error")
        }
    }
}