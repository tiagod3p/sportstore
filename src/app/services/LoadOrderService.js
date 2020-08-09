const Order = require("../models/Order")
const User = require("../models/User")

const LoadProductService = require("../services/LoadProductService")

const { formatPrice, dateFormatted } = require("../../lib/utils")

async function format(order) {
    // product details
    order.product = await LoadProductService.load("productWithDeleted", {where: {
        id: order.product_id
    }})

    // buyer details
    order.buyer = await User.find(order.buyer_id)

    // seller details
    order.seller = await User.find(order.seller_id) 

    // price formatted
    order.formattedPrice = formatPrice(order.price)
    order.formattedTotal = formatPrice(order.total)

    // statuses
    const statuses = {
        open: "Open",
        sold: "Sold",
        canceled: "Canceled"
    }

    order.formattedStatus = statuses[order.status]

    // updated
    order.formattedUpdatedAt = `${order.formattedStatus} in ${dateFormatted(order.updated_at).brasil}`

    return order
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    async order() {
        try {
            const order = await Order.findOne(this.filter)
            return format(order)

        } catch (err) {
            console.error(err)
        }
    },
    async orders() {
        try {
            const orders = await Order.findAll(this.filter)
            const ordersPromise = orders.map(format)
            return Promise.all(ordersPromise)

        } catch (err) {
            console.error(err)
        }
    },
    format
}

module.exports = LoadService