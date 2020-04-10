const { Pool,Client } = require('pg')

const pool = new Pool({
    user:'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'saravana',
    port: 5432
})

module.exports = pool 