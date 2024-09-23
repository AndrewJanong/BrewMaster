const database = require('../connect_database');
const { generateEmployeeId, isValidEmail, isValidGender, isValidPhoneNumber } = require('../utils/employeeUtils');

// Get Employees based on cafe and sorted by the highest number of days worked first
const getEmployees = async (req, res) => {
    try {
        const cafe = req.query.cafe; // Get location from query parameters
        const cafeCondition = cafe ? 'WHERE cafe_match.name = ?' : '';

        // SQL query to get all employees (based on cafe if provided) sorted by number of days worked
        let getEmployeesQuery = `
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

        const queryParams = cafe ? [cafe] : [];

        // Execute the query
        const [results] = await database.promise().query(getEmployeesQuery, queryParams);

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching employees:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Validates data for the employee to be inserted or updated
const validateEmployeeData = (req, res) => {
    const { name, email_address, phone_number, gender } = req.body;

    // Validate that the required fields are present
    if (!name || !email_address || !phone_number || !gender) {
        return res.status(400).json({ error: 'Name, email address, phone number, and gender are required.' });
    }

    // Check for valid email
    if (!isValidEmail(email_address)) {
        return res.status(400).json({ error: 'Invalid email address format.' });
    }

    // Validate phone number
    if (!isValidPhoneNumber(phone_number)) {
        return res.status(400).json({ error: 'Phone number must start with 8 or 9 and be 8 digits long.' });
    }

    // Check for valid gender
    if (!isValidGender(gender)) {
        return res.status(400).json({ error: 'Gender must be either Male or Female.' });
    }

    return null; // Return null if validation passes
};

// Create Employee
const createEmployee = async (req, res) => {
    try {
        // Destructure the employee details from the request body
        const { name, email_address, phone_number, gender, cafe } = req.body;

        // Validate that the required fields are present
        const validationError = validateEmployeeData(req, res);
        if (validationError) return validationError;
    
        // Generate employee ID
        const id = generateEmployeeId();

        // Use the current date for start_date
        const start_date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // SQL query to get the cafe ID based on cafe name
        const getCafeIdQuery = 'SELECT id FROM Cafe WHERE name = ?';
        const [cafeResults] = await database.promise().query(getCafeIdQuery, [cafe]);

        if (cafe && cafeResults.length === 0) {
            return res.status(404).json({ error: 'Cafe name does not exist.' });
        }

        const cafe_id = cafe ? cafeResults[0].id : null; // Get the cafe ID

        // SQL query to insert the new employee into the Employee table
        const insertEmployeeQuery = `
            INSERT INTO Employee (id, name, email_address, phone_number, gender) 
            VALUES (?, ?, ?, ?, ?);
        `;

        // Execute the employee insert query
        await database.promise().query(insertEmployeeQuery, [id, name, email_address, phone_number, gender]);

        // SQL query to insert the employee-cafe relationship into Employee_Cafe table
        if (cafe_id) {
            const insertEmployeeCafeQuery = `
                INSERT INTO Employee_Cafe (employee_id, cafe_id, start_date) 
                VALUES (?, ?, ?);
            `;

            // Execute the relationship insert query
            await database.promise().query(insertEmployeeCafeQuery, [id, cafe_id, start_date]);
        }

        // Successfully inserted the new employee and relationship (if any)
        res.status(201).json({
            id,
            name,
            email_address,
            phone_number,
            gender,
            cafe,
            message: 'Employee created successfully'
        });
    } catch (error) {
        console.error('Error creating employee:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Employee with this email or phone number already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Edit Employee
const editEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id; // Get the employee ID from URL parameters

        // Destructure the employee details from the request body
        const { name, email_address, phone_number, gender, cafe } = req.body;

        // Validate that the required fields are present
        const validationError = validateEmployeeData(req, res);
        if (validationError) return validationError;

        // Use the current date for start_date
        const start_date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Query to get the current cafe_id for the employee
        const getCurrentCafeQuery = `
            SELECT cafe_id FROM Employee_Cafe WHERE employee_id = ?
        `;
        const [currentCafeResults] = await database.promise().query(getCurrentCafeQuery, [employeeId]);

        const currentCafeId = currentCafeResults.length ? currentCafeResults[0].cafe_id : null;

        // Query to get the new cafe_id based on cafe name
        const getNewCafeIdQuery = `SELECT id FROM Cafe WHERE name = ?`;
        const [cafeResults] = await database.promise().query(getNewCafeIdQuery, [cafe]);

        if (cafe && cafeResults.length === 0) {
            return res.status(404).json({ error: 'Cafe not found' });
        }

        const newCafeId = cafe ? cafeResults[0].id : null;

        // SQL query to update the Employee details
        const updateEmployeeQuery = `
            UPDATE Employee SET name = ?, email_address = ?, phone_number = ?, gender = ? WHERE id = ?
        `;
        await database.promise().query(updateEmployeeQuery, [name, email_address, phone_number, gender, employeeId]);

        if (newCafeId && currentCafeId === null) { // If currently unemployes, insert to Employee_Cafe table
            const insertEmployeeCafeQuery = `
                INSERT INTO Employee_Cafe (employee_id, cafe_id, start_date) 
                VALUES (?, ?, ?); 
            `
            await database.promise().query(insertEmployeeCafeQuery, [employeeId, newCafeId, start_date]);
        } else if (newCafeId && newCafeId !== currentCafeId) { // If the cafe has changed, update the Employee_Cafe table
            const updateEmployeeCafeQuery = `
                UPDATE Employee_Cafe SET cafe_id = ?, start_date = ? WHERE employee_id = ?
            `;
            await database.promise().query(updateEmployeeCafeQuery, [newCafeId, start_date, employeeId]);
        } else if (newCafeId === null && currentCafeId) { // If now unemployes, delete from Employee_Cafe table
            const deleteEmployeeCafeQuery = `
                DELETE FROM Employee_Cafe WHERE employee_id = ? AND cafe_id = ?
            `;
            await database.promise().query(deleteEmployeeCafeQuery, [employeeId, currentCafeId]);
        }

        res.status(200).json({
            message: 'Employee updated successfully',
            id: employeeId,
            name,
            email_address,
            phone_number,
            gender,
            cafe
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Employee with this email or phone number already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete Employee, this will delete the employee in the Employee_Cafe table as well
const deleteEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id; // Get the employee ID from URL parameters

        // SQL query to delete employee from Employee table
        const sqlDeleteEmployee = `DELETE FROM Employee WHERE id = ?`;

        const [result] = await database.promise().query(sqlDeleteEmployee, [employeeId]);

        // If the employee does not exist
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Successful deletion response
        res.status(200).json({ 
            message: 'Employee deleted successfully', 
            id: employeeId 
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { getEmployees, createEmployee, editEmployee, deleteEmployee };