const express = require("express");
const app = express();
const connection = require('./connect_database');

// Import routes
const cafesRoutes = require('./routes/cafes');
const employeesRoutes = require('./routes/employees');

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/cafes', cafesRoutes);
app.use('/employees', employeesRoutes);

// Route to check that API is running
app.get('/', (req, res) => {
    res.json({ message: "API is running" });
});

// Start the server and connect to the database
app.listen(4000, () => {
    console.log('App listening on port 4000');
    connection.query('SELECT 1', (err, results) => {
        if (err) throw err;
        console.log('Database connected');
    });
});