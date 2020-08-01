const User = require('../models/User')
const { compare } = require('bcryptjs')

module.exports = {
    async post(req, res, next) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.render("user/register", {
                    error: "Please fill in all fields!",
                    user: req.body
                })
            }
        }

        // checking if user already exists in the database
        let { email, cpf_cnpj, password, passwordRepeat } = req.body

        // transforming in number to compar in database
        cpf_cnpj = cpf_cnpj.replace(/\D/g, "") 

        const userExists = await User.findOne({
            where: {email},
            or: {cpf_cnpj}
        }) 

        if (userExists) return res.render("users/register", {
            error: "This account already exists!",
            user: req.body
        })

        // checking if password != passwordRepeat
        if (password !== passwordRepeat) return res.render("users/register", {
            error: "Password mismatch!",
            user: req.body
        })

        next()
    },
    async show(req, res, next) {
        try {
            const user = await User.findOne({ where: { id:req.session.userId } })

            if (!user)
                return res.render('user/register', { error: 'Usuário não encontrado.' })
        
            req.user = user
        } catch (err) {
            console.error(err)
            return res.redirect("/user/login")
        }

        next()
    },
    async update(req,res,next) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.render("users/index", {
                        error: "Please fill in all fields!",
                        user: req.body
                    })
                }
            }
    
            const { id, password } = req.body
    
            if (!password) return res.render("users/index", {
                error: "Type your password to authenticate",
                user: req.body
            })
    
            const user = await User.findOne({ where: { id }})
    
            const passwordCorrectly = await compare(password, user.password)

            if (!passwordCorrectly) return res.render("users/index", {
                error: "Password incorrect.",
                user: req.body
            })

        } catch (err) {
            console.error(err)
        }

        next()
    }
}