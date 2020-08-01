const { hash } = require("bcryptjs")
const { unlinkSync } = require('fs')

const User = require('../models/User')
const Product = require('../models/Product')
const LoadService = require('../services/LoadProductService')

const { formatCpfCnpj, formatCep } = require('../../lib/utils')

module.exports = {
    registerForm(req, res) {
        return res.render("users/register")
    },
    async post(req, res) {
        try {
            let {name, email, password, cpf_cnpj, cep, address}  = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "") 
            cep = cep.replace(/\D/g, "") 
    

            password = await hash(password, 8)
    
            const userId = await User.add({
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            })
    
            req.session.userId = userId
    
            return res.redirect("/user/dashboard")
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
            // get all products of the id
            const products = await Product.findAll({ where: { user_id: req.body.id}})

            // get all files of these products
            let filesPromise = products.map(product => Product.files(product.id))
            let filesResults = await Promise.all(filesPromise)

            // delete the user
            await User.delete(req.body.id)
            req.session.destroy()

            // remove imgs of public
            filesResults.map(files => {
                files.map(file => unlinkSync(file.path))
            })

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
    },
    async ads(req, res) {
        try {
            const user_id = req.session.userId
            const products = await LoadService.load("products", {where: {user_id}})

            return res.render("users/ads", { products })
        } catch(err) {
            console.error(err)
            return res.render("/", {
                error: "An error ocurred, please try again later!"
            })
        }

    }
}
