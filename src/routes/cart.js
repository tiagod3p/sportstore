const express = require('express')
const routes = express.Router()

const CartController = require('../app/controllers/CartController')

routes.get("/", CartController.index)
routes.post("/:id/add-one", CartController.addOne)
routes.post("/:id/delete-one", CartController.deleteOne)
routes.post("/:id/delete-all", CartController.deleteAll)

module.exports = routes

