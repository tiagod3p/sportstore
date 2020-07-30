const db = require("../../config/db")
const fs = require('fs')
const { hash } = require("bcryptjs")
const Product = require("../models/Product")

module.exports = {
    async findOne(filters) {
        let query = `SELECT * FROM users`

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}`

            Object.keys(filters[key]).map(otherKey => {
                query = `${query} ${otherKey} = '${filters[key][otherKey]}'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    },
    async add(data) {

        try {
            const query = `
            INSERT INTO users (
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`
    
            // hash of password
            const passwordEncrypted = await hash(data.password, 8)
    
            const values = [
                data.name,
                data.email,
                passwordEncrypted,
                data.cpf_cnpj,
                data.cep,
                data.address
            ]
    
            const results = await db.query(query, values)
            return results.rows[0].id
        } catch(err) {
            console.error(err)
        }
    },
    async update(id, fields) {
        let query = `UPDATE users SET`
        
        Object.keys(fields).map( (key, index, array) => {
            if ( (index + 1 ) < array.length) {
                query = `${query}
                ${key} = '${fields[key]}',`
            } 
            else {
                // last index index + 1 == array.length
                query = `${query}
                ${key} = '${fields[key]}'
                WHERE id = ${id}`
            }
        })

        await db.query(query)
    },
    async delete(id) {
        // get all products of the id
        let results = await db.query(`SELECT * FROM products WHERE user_id = $1`, [id])

        // get all files of these products
        let filesPromise = results.rows.map(product => Product.files(product.id))
        let filesResults = await Promise.all(filesPromise)

        // delete the user
        await db.query(`DELETE FROM users WHERE id=$1`, [id])

        // remove imgs of public
        filesResults.map(results => {
            results.rows.map(file => fs.unlinkSync(file.path))
        })


    }
}