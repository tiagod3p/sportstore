const User = require('../models/User')
const { compare } = require('bcryptjs')

module.exports = {
    async post(req, res, next) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.render("users/login", {
                        error: "Please fill in all fields!",
                        user: req.body
                    })
                }
            }

            let { email, password } = req.body

            const user = await User.findOne({
                where: {email}
            }) 

            if (!user) return res.render("users/login", {
                error: "We can't find an account with that email address!",
                user: req.body
            })

            const passwordCorrectly = await compare(password, user.password)

            if (!passwordCorrectly) return res.render("users/login", {
                error: "Your password is incorrect!",
                user: req.body
            })

            req.user = user
        } catch (err) {
            console.error(err)
            return res.render("users/login", {
                error: "An error ocurred! Please, try again later.",
                user: req.body
            })
        }

        next()
    },
    async forgotPost(req, res, next) {
        let { email } = req.body

        if (!email) return res.render('users/forgot-pass', {
            error: "Enter your email"
        })

        const user = await User.findOne({
            where: {email}
        }) 

        if (!user) return res.render("users/forgot-pass", {
            error: "We can't find an account with that email address!",
            user: req.body
        })

        req.user = user

        next()
    },
    async resetPost(req, res, next) {
        try {
            const { token } = req.body

            if (!token) {
                return res.render("users/login", {
                    error: "Invalid token!"
                })
            }
    
            const user = await User.findOne({ where: {reset_token: token}})
    
            if (!user) {
                return res.render("users/login", {
                    error: "Invalid token!"
                })
            }

            let now = new Date()
            now = now.setHours(now.getHours())

            if (now > user.reset_token_expires) {
                return res.render("users/login", {
                    error: "Your token has expired! Request a new one."
                })
            }
    
            let { email, password, passwordRepeat } = req.body
    
            if (user.email != email) {
                return res.render("users/reset-pass", {
                    error: "Invalid email!",
                    token
                })
            }
    
            if (password !== passwordRepeat) {
                return res.render("users/reset-pass", {
                    error: "Password mismatch!",
                    token
                })
            }

            req.user = user
            req.password = password

            next()
        
        } catch(err) {
            console.error(err)
            return res.render("users/reset-pass", {
                error: "An error ocurred! Please, try again later.",
                token
            })
        }

    }   
}