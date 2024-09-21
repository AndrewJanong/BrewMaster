const database = require('../connect_database');

// get Cafes based on location and sorted by the highest number of employees first
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

        database.query(sql_query, (err, results) => {
            if (err) throw err;
            
            res.json(results);
        }) 
    } catch (error) {
        console.error('Error fetching cafes:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {getCafes};