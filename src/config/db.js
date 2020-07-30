const { Pool } = require('pg')

module.exports = new Pool({
    user: "tiago",
    password:"123",
    host: "localhost",
    port: 5432,
    database: "sportstore"
})