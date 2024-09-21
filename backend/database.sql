-- Create Employee table
CREATE TABLE Employee (
    id VARCHAR(9) PRIMARY KEY, -- Format 'UIXXXXXXX'
    name VARCHAR(100) NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(8) UNIQUE CHECK (phone_number LIKE '9%' OR phone_number LIKE '8%'),
    gender ENUM('Male', 'Female') NOT NULL
);

-- Create Cafe table
CREATE TABLE Cafe (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    logo VARCHAR(255), -- Optional
    location VARCHAR(255) NOT NULL
);

-- Create junction table for Employee-Cafe relationship
CREATE TABLE Employee_Cafe (
    employee_id VARCHAR(9),
    cafe_id CHAR(36),
    start_date DATE NOT NULL,
    PRIMARY KEY (employee_id, cafe_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE,
    FOREIGN KEY (cafe_id) REFERENCES Cafe(id) ON DELETE CASCADE
);