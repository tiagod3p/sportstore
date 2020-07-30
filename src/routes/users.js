const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const ValidatorUser = require('../app/validators/user')
const ValidatorSession = require('../app/validators/session')

const { userLogged, userNotLogged } = require('../app/middlewares/session')

// // LOGIN AND LOGOUT
routes.get("/login", userLogged, SessionController.loginForm)
routes.post("/login", userLogged, ValidatorSession.post, SessionController.login)
routes.post("/logout", SessionController.logout)

// // FORGOT PASSWORD
routes.get("/forgot-password", SessionController.forgotForm)
routes.get("/reset-password", SessionController.resetForm)
routes.post("/forgot-password", ValidatorSession.forgotPost, SessionController.forgot)
routes.post("/reset-password", ValidatorSession.resetPost, SessionController.reset)

// USER REGISTER
routes.get("/register", userLogged, UserController.registerForm)
routes.post("/register", userLogged, ValidatorUser.post, UserController.post)

// DASHBOARD
routes.get("/dashboard", userNotLogged, ValidatorUser.show, UserController.show)
routes.put("/dashboard", userNotLogged, ValidatorUser.update, UserController.update)
routes.delete("/dashboard", UserController.delete)

module.exports = routes

