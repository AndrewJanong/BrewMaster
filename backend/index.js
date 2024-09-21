const express = require("express");
const app = express();
const connection = require('./connect_database');

// Middleware to parse JSON requests
app.use(express.json());


// Route to get all employees
app.get('/', (req, res) => {
    let sql = "SELECT * FROM employee"; // SQL query to select all employees
    connection.query(sql, (err, results) => {
        if (err) {
            // Handle the error appropriately
            console.error("Database query error:", err);
            return res.status(500).send("Internal Server Error");
        }

        res.json(results);
    });
});

// Start the server and connect to the database
app.listen(4000, () => {
    console.log('App listening on port 4000');
    connection.connect((err) => {
        if (err) throw err;
        console.log('Database connected');
    })
});