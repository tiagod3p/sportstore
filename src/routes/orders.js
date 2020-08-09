const express = require('express')
const routes = express.Router()

const OrderController = require('../app/controllers/OrderController')
const { userNotLogged } = require('../app/middlewares/session')

routes.get("/", userNotLogged, OrderController.index)
routes.post("/", userNotLogged, OrderController.post)

routes.get("/sales", userNotLogged, OrderController.sales)

routes.get("/:id", userNotLogged, OrderController.show)
routes.post("/:id/close", userNotLogged, OrderController.close)
routes.post("/:id/cancel", userNotLogged, OrderController.cancel)


module.exports = routes

