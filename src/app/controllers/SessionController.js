const crypto = require('crypto')
const User = require('../models/User')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

module.exports = {
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    },
    loginForm(req, res) {
        return res.render('users/login')
    },
    async login(req, res) {
        const { user } = req

        req.session.userId = user.id

        return res.redirect('/')
    },
    forgotForm(req, res) {
        return res.render('users/forgot-pass')
    },
    async forgot(req, res) {
        const { user } = req

        try {
            // create token to validate recovery
            const token = crypto.randomBytes(20).toString("hex")

            // create validation time for the token ( 1 hour )
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            // passing this infos to database
            await User.update(user.id, { reset_token: token, reset_token_expires: now })

            // sending recovery email
            await mailer.sendMail({
                to: user.email,
                from: 'noreply@sportstore.com',
                subject: `Recovery Password ${user.name}`,
                html: `<h2>Password assistance</h2>
                <p>To authenticate, please use the following link</p>
                <p>
                    <a href="http://localhost:5000/users/reset-password?token=${token}" target="_blank">
                        Reset your password
                    </a>
                </p>
                <p>Do not share this link with anyone</p>
                `
            })

            return res.render("users/forgot-pass", {
                success: "Verify your mail box to reset your password."
            })

        } catch(err) {
            console.error(err)
            return res.render("users/forgot-pass", {
                error: "An error ocurred! Please, try again later."
            })
        }

    },
    resetForm(req, res) {
        return res.render("users/reset-pass", {token: req.query.token})
    },
    async reset(req, res) {
        const { user, password } = req
        const { token } = req.body

        try {
            const passwordEncrypted = await hash(password, 8)

            await User.update(user.id, { 
                password: passwordEncrypted,
                reset_token: "",
                reset_token_expires: ""
            })
    
            return res.render("users/login", {
                success: "Password Reset Successfully! Sign in with your new password.",
                user: req.body
            })
        } catch(err) {
            console.error(err)
            return res.render("users/reset-pass", {
                error: "An error ocurred! Please, try again later.",
                token,
                user: req.body
            })
        }
    }

}