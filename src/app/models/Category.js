const db = require('../../config/db')

module.exports =  {
    select() {
        // promise
        return db.query(`SELECT * FROM categories`)
    },
}