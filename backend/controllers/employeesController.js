const database = require('../connect_database');

// get Employees based on cafe and sorted by the highest number of days worked first
const getEmployees = (req, res) => {
    try {
        const cafe = req.query.cafe; // Get location from query parameters
        const cafeCondition = cafe ? `WHERE cafe_match.name = '${cafe}'` : '';

        // SQL query to get all employees (based on cafe if provided) sorted by number of days worked
        let sql_query = `
            SELECT employee.id, 
                employee.name, 
                employee.email_address, 
                employee.phone_number, 
                COALESCE(cafe_match.name, '') as cafe, 
                COALESCE(DATEDIFF(CURRENT_DATE, cafe_match.start_date), 0) as days_worked
            FROM employee LEFT JOIN (
                SELECT employee_cafe.employee_id, employee_cafe.cafe_id, cafe.name, employee_cafe.start_date
                FROM cafe, employee_cafe
                WHERE cafe.id = employee_cafe.cafe_id
            ) as cafe_match ON employee.id = cafe_match.employee_id
            ${cafeCondition}
            ORDER BY days_worked DESC;
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


module.exports = {getEmployees};