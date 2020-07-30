const db = require("../../config/db")

module.exports = {
    select() {
        return db.query(`SELECT * FROM products ORDER BY updated_at DESC`)
    },
    add(data) {
        const query = `
        INSERT INTO products (
            category_id,
            user_id,
            name,
            description,
            old_price,
            price,
            quantity,
            status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`

        data.price = data.price.replace(/\D/g, "")

        const values = [
            data.category_id,
            data.user_id,
            data.name,
            data.description,
            data.old_price || data.price,
            data.price,
            data.quantity,
            data.status || 1
        ]

        return db.query(query, values)
        
    },
    find(id) {
        return db.query(`SELECT * FROM products WHERE id=($1)`, [id])
    },
    update(data) {
        const query = `
        UPDATE products SET
        category_id = $1,
        name = $2,
        description = $3,
        old_price = $4,
        price = $5,
        quantity = $6,
        status = $7
        WHERE id = $8
        RETURNING id
       `

        data.price = data.price.replace(/\D/g, "")
        // Remember division by 100 when pass to front-end
        const values = [
            data.category_id,
            data.name,
            data.description,
            data.old_price || data.price,
            data.price,
            data.quantity,
            data.status || 1,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        const query = `DELETE FROM products WHERE id=$1`
        const values = [id]

        return db.query(query, values)
    },
    files(id) {
        return db.query(`SELECT * FROM files WHERE product_id = $1`, [id])
    },
    search(params) {

        const { filter, category } = params

        let query = "",
            filterQuery = `WHERE`

        if (category) {
            filterQuery = `${filterQuery}
            products.category_id = ${category}
            AND`
        }

        filterQuery = `${filterQuery}
        (products.name ILIKE '%${filter}%'
        OR products.description ILIKE '%${filter}%')`

        query = `SELECT products.*, categories.name as category_name
        FROM products
        LEFT JOIN categories ON (categories.id = products.category_id)
        ${filterQuery}
        GROUP BY products.id, categories.name`
        
        return db.query(query)
    }
}