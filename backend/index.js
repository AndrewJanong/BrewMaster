const express = require("express");
const app = express();

// Import routes
const cafesRoutes = require('./routes/cafes');

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/cafes', cafesRoutes);

// Route to check that API is running
app.get('/', (req, res) => {
    res.json({ message: "API is running" });
});

// Start the server and connect to the database
app.listen(4000, () => {
    console.log('App listening on port 4000');
    connection.connect((err) => {
        if (err) throw err;
        console.log('Database connected');
    })
});