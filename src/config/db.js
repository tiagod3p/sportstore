const { Pool } = require('pg')

module.exports = new Pool({
    user: "tiago",
    password:"goma123456@",
    host: "localhost",
    port: 5432,
    database: "sportstore"
})