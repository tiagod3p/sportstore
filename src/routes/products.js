const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ProductController = require('../app/controllers/ProductController')
const { userNotLogged } = require('../app/middlewares/session')

const ValidatorProduct = require('../app/validators/product')

routes.get('/add', userNotLogged, ProductController.add)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', userNotLogged, ProductController.edit)

routes.post('/', userNotLogged, multer.array("images", 6), ValidatorProduct.post, ProductController.post)
routes.put('/', userNotLogged, multer.array("images", 6), ValidatorProduct.update , ProductController.update)
routes.delete('/', userNotLogged, ProductController.delete)

module.exports = routes