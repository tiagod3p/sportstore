// cart kept in req.session (oldCart)
const { formatPrice } = require("./utils")

const Cart = {
    init(oldCart) {
        if(oldCart) {
            this.items = oldCart.items
            this.total = oldCart.total
        } else {
            this.items = []
            this.total = {
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0)
            }
        }

        return this
    },
    addOne(product) {
        let inCart = this.items.find(item => item.product.id == product.id)

        if (!inCart) {
            inCart = {
                product: {
                    ...product,
                    formattedPrice: formatPrice(product.price)
                },
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0)
            }

            this.items.push(inCart)
        }

        if (inCart.quantity >= product.quantity) return this

        inCart.quantity += 1
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formattedPrice = formatPrice(inCart.price)

        this.total.quantity += 1
        this.total.price += product.price
        this.total.formattedPrice = formatPrice(this.total.price)
        
        return this
    },
    deleteOne(productId) {
        let inCart = this.items.find(item => item.product.id == productId)
        if (!inCart) {
            return this
        }

        inCart.quantity -= 1
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formattedPrice = formatPrice(inCart.price)

        this.total.quantity -= 1
        this.total.price -= inCart.product.price
        this.total.formattedPrice = formatPrice(this.total.price)
        
        if (inCart.quantity < 1) {
            const index = this.items.indexOf(inCart)
            this.items.splice(index, 1)
        }

        return this
    },
    deleteAll(productId) {
        let inCart = this.items.find(item => item.product.id == productId)
        if (!inCart) {
            return this
        }

        if (this.items.length > 0) {
            this.total.quantity -= inCart.quantity
            this.total.price -= inCart.price
            this.total.formattedPrice = formatPrice(this.total.price)
        }

        const index = this.items.indexOf(inCart)
        this.items.splice(index, 1)

        return this
    }
}

module.exports = Cart