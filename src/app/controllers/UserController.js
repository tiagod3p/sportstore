const User = require('../models/User')
const { formatCpfCnpj, formatCep } = require('../../lib/utils')

module.exports = {
    registerForm(req, res) {
        return res.render("users/register")
    },
    async post(req, res) {
        try {
            req.body.cpf_cnpj = req.body.cpf_cnpj.replace(/\D/g, "") 
            req.body.cep = req.body.cep.replace(/\D/g, "") 
    
            const userId = await User.add(req.body)
    
            req.session.userId = userId
    
            return res.redirect("/users/dashboard")
        } catch (err) {
            console.error(err)
            return res.render("users/login", {
                error: "An error ocurred! Please, try again later.",
                user: req.body
            })
        }

    },
    async show(req, res) {
        const { user } = req
        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('users/index', { 
            user,
            success: `WELCOME ${user.name}!`
         })
    
    },
    async update(req, res) {
        try {
            let { id, name, email, cpf_cnpj, cep, address}  = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "") 
            cep = cep.replace(/\D/g, "") 
    
            await User.update(id, {
                name,
                email,
                cpf_cnpj,
                cep,
                address
            })
            
            return res.render("users/index", { 
                user: req.body,
                success: "Account updated with successful! " })
        } catch(err) {
            console.error(err)
            return res.render("users/index", {
                user: req.body,
                error: "Oops, an error occurred! Try again."
            })
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id)
            req.session.destroy()

            return res.render("users/login", {
                success: "Your account and your products has been deleted!"
            })

        } catch(err) {
            console.error(err)
            return res.render("users/index", {
                error: "An error ocurred! Please, try again later.",
                user: req.body
            })
        }
    }
}