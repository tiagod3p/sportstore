const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ProductController = require('../app/controllers/ProductController')
const { userNotLogged } = require('../app/middlewares/session')

routes.get('/add', userNotLogged, ProductController.add)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', userNotLogged, ProductController.edit)

routes.post('/', userNotLogged, multer.array("images", 6), ProductController.post)
routes.put('/', userNotLogged, multer.array("images", 6), ProductController.update)
routes.delete('/', userNotLogged, ProductController.delete)

module.exports = routes