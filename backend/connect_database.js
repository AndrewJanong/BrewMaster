const mysql = require("mysql2");

// Load environment variables from .env file
require('dotenv').config();

// Create a database connection using environment variables
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

module.exports = connection;