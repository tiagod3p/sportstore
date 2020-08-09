const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')
const SearchController = require('../app/controllers/SearchController')

const users = require('./users')
const products = require('./products')
const cart = require('./cart')
const orders = require('./orders')

routes.get('/', HomeController.index)
routes.get('/search', SearchController.index)

routes.use("/user", users)
routes.use("/products", products)
routes.use("/cart", cart)
routes.use("/orders", orders)

// ALIAS ---> ATALHO
routes.get('/ads/add', function(req, res) {
    return res.redirect('/products/add')
})

routes.get('/accounts', function(req, res) {
    return res.redirect('/user/dashboard')
})

module.exports = routes