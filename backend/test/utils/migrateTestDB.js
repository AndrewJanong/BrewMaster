const database = require('../../connect_database');

const migrateTestDB = async () => {  
    const pool = await database.promise();

    // Drop tables if they exist (optional, for a clean slate)
    await pool.query('DROP TABLE IF EXISTS Employee_Cafe');
    await pool.query('DROP TABLE IF EXISTS Employee');
    await pool.query('DROP TABLE IF EXISTS Cafe');
  
    // Create Employee table
    await pool.query(`
        CREATE TABLE Employee (
            id VARCHAR(9) PRIMARY KEY, -- Format 'UIXXXXXXX'
            name VARCHAR(100) NOT NULL,
            email_address VARCHAR(255) UNIQUE NOT NULL,
            phone_number VARCHAR(8) UNIQUE CHECK (phone_number LIKE '9%' OR phone_number LIKE '8%'),
            gender ENUM('Male', 'Female') NOT NULL
        );
    `);
  
    // Create Cafe table
    await pool.query(`
        CREATE TABLE Cafe (
            id CHAR(36) PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            description TEXT NOT NULL,
            logo VARCHAR(255), -- Optional
            location VARCHAR(255) NOT NULL
        );
    `);
  
    // Create junction table for Employee-Cafe relationship
    await pool.query(`
        CREATE TABLE Employee_Cafe (
            employee_id VARCHAR(9),
            cafe_id CHAR(36),
            start_date DATE NOT NULL,
            PRIMARY KEY (employee_id),
            FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE,
            FOREIGN KEY (cafe_id) REFERENCES Cafe(id) ON DELETE CASCADE
        );
    `);
  
    // Insert seed data for testing
    await pool.query(`
        INSERT INTO Employee (id, name, email_address, phone_number, gender) VALUES 
        ('UI0000001', 'John Doe', 'john.doe@example.com', '91234567', 'Male'),
        ('UI0000002', 'Jane Smith', 'jane.smith@example.com', '82345678', 'Female'),
        ('UI0000003', 'Michael Johnson', 'michael.johnson@example.com', '91237654', 'Male'),
        ('UI0000004', 'Emily Davis', 'emily.davis@example.com', '82346789', 'Female'),
        ('UI0000005', 'Antony', 'antony@example.com', '82387938', 'Male'),
        ('UI0000006', 'Lionel Messi', 'lionel.messi@example.com', '93906789', 'Male');
    `);
  
    await pool.query(`
        INSERT INTO Cafe (id, name, description, logo, location) VALUES 
        ('a1b2c3d4-e5f6-7890-abcd-1234567890ab', 'Cafe Blue', 'A cozy cafe with great ambiance', 'https://example.com/logo1.png', 'Downtown'),
        ('b2c3d4e5-f6a7-8901-bcde-2345678901bc', 'Green Coffee', 'Specializes in organic coffee', NULL, 'Uptown'),
        ('c3d4e5f6-a7b8-9012-cdef-3456789012cd', 'Red Espresso', 'Best espresso in town', 'https://example.com/logo2.png', 'Suburbs'),
        ('d4e5f6a7-b8c9-0123-defg-4567890123de', 'Yellow Bean', 'Popular spot for students', NULL, 'City Center');
    `);

    await pool.query(`
        INSERT INTO Employee_Cafe (employee_id, cafe_id, start_date) VALUES 
        ('UI0000001', 'a1b2c3d4-e5f6-7890-abcd-1234567890ab', '2022-05-01'),
        ('UI0000002', 'b2c3d4e5-f6a7-8901-bcde-2345678901bc', '2022-06-15'),
        ('UI0000003', 'c3d4e5f6-a7b8-9012-cdef-3456789012cd', '2023-01-20'),
        ('UI0000004', 'c3d4e5f6-a7b8-9012-cdef-3456789012cd', '2023-03-10'),
        ('UI0000005', 'c3d4e5f6-a7b8-9012-cdef-3456789012cd', '2024-03-10'),
        ('UI0000006', 'b2c3d4e5-f6a7-8901-bcde-2345678901bc', '2023-07-10');
    `)
};
  
module.exports = migrateTestDB;