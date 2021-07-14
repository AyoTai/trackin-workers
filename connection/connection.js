const mysql = require('mysql');

const connection = mysql.createconnection({
    host: 'localhost',
    port: 3001,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

module.export = connection;