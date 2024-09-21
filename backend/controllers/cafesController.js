const database = require('../connect_database');
const { v4: uuidv4 } = require('uuid');

// Get Cafes based on location and sorted by the highest number of employees first
const getCafes = (req, res) => {
    try {
        const location = req.query.location; // Get location from query parameters
        const locationCondition = location ? `WHERE cafe.location = '${location}'` : '';

        // SQL query to get all cafes (based on location if provided) and sorted by employee count
        let sql_query = `
            SELECT cafe.id, cafe.name, cafe.description, cafe.logo, cafe.location, COUNT(employee_cafe.employee_id) as employees
            FROM cafe LEFT JOIN employee_cafe ON cafe.id = employee_cafe.cafe_id
            ${locationCondition}
            GROUP BY cafe.id, cafe.name, cafe.description, cafe.logo, cafe.location
            ORDER BY COUNT(employee_cafe.employee_id) DESC;
        `

        // Execute the query
        database.query(sql_query, (err, results) => {
            if (err) throw err;
            
            res.status(200).json(results);
        }) 
    } catch (error) {
        console.error('Error fetching cafes:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Create Cafe 
const createCafe = (req, res) => {
    try {
        // Destructure the cafe details from the request body
        const { name, description, logo, location } = req.body;

        // Validate that the required fields are present
        if (!name || !description || !location) {
            return res.status(400).json({ error: 'Name, description, and location are required.' });
        }

        // Generate a unique ID for the cafe
        const id = uuidv4();

        // SQL query to insert the new cafe into the database
        const sql_query = `
            INSERT INTO Cafe (id, name, description, logo, location) 
            VALUES (?, ?, ?, ?, ?);
        `;

        // Execute the query
        database.query(sql_query, [id, name, description, logo, location], (err, result) => {
            if (err) {
                console.error('Error inserting cafe:', err);

                if (err.code == 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Cafe with this name already exists' });
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Successfully inserted the new cafe
            res.status(201).json({
                id,
                name,
                description,
                logo,
                location,
                message: 'Cafe created successfully'
            });
        });
    } catch (error) {
        console.error('Error creating cafe:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Edit Cafe 
const editCafe = (req, res) => {
    try {
        const cafeId = req.params.id; // Get the cafe ID from URL parameters

        // Destructure the cafe details from the request body
        const { name, description, logo, location } = req.body;

        // Validate that the required fields are present
        if (!name || !description || !location) {
            return res.status(400).json({ error: 'Name, description, and location are required.' });
        }

        // SQL query to update the Cafe details
        const sql_query = `
            UPDATE Cafe
            SET name = ?, description = ?, logo = ?, location = ?
            WHERE id = ?;
        `;

        // Execute the query
        database.query(sql_query, [name, description, logo, location, cafeId], (err, result) => {
            if (err) {
                console.error('Error updating cafe:', err);

                if (err.code == 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Cafe with this name already exists' });
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cafe not found' });
            }

            // Successfully edited cafe
            res.status(200).json({
                id: cafeId,
                name,
                description,
                logo,
                location
            });
        });
    } catch (error) {
        console.error('Error editing cafe:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// Delete Cafe
const deleteCafe = (req, res) => {
    const cafeId = req.params.id; // Get cafe ID from the URL parameter

    // SQL query to delete the cafe by its ID
    const sql = 'DELETE FROM Cafe WHERE id = ?';

    // Execute the query
    database.query(sql, [cafeId], (err, result) => {
        if (err) {
            console.error('Error deleting cafe:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cafe not found' });
        }

        // Successfully deleted cafe
        res.status(200).json({
            message: 'Cafe deleted successfully',
            id: cafeId
        });
    });
};


module.exports = { getCafes, createCafe, editCafe, deleteCafe };