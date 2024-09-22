const mysql = require("mysql2");

// Load environment variables from .env file
require('dotenv').config();

// Check if the environment is set to 'test'
const isTestEnvironment = process.env.NODE_ENV === 'test';

// Create a database connection using environment variables
const connection = mysql.createPool({
    host: isTestEnvironment ? process.env.DB_HOST_TEST : process.env.DB_HOST,
    database: isTestEnvironment ? process.env.DB_DATABASE_TEST : process.env.DB_DATABASE,
    user: isTestEnvironment ? process.env.DB_USER_TEST : process.env.DB_USER,
    password: isTestEnvironment ? process.env.DB_PASSWORD_TEST : process.env.DB_PASSWORD,
});

module.exports = connection;