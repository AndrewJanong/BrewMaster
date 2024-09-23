const request = require('supertest');
const app = require('../index'); // Import your Express app
const database = require('../connect_database');
const migrateTestDB = require('./utils/migrateTestDB');

const expectedEmployees = require('./fixtures/expectedEmployees.json');
const employeeTestData = require('./fixtures/employeeTestData');

beforeAll(async () => {
    await migrateTestDB(); // Set up test database
});

afterAll(async () => {
    await database.end();
});

describe('Employees API', () => {
    describe('GET /employees?cafe=<cafe>', () => {
        it ("Return a list of all employees sorted by number of days worked if cafe not provided", async () => {
            const res = await request(app).get("/employees");
            expect(res.statusCode).toEqual(200);

            // Check that it gets all the employees
            expect(res.body).toHaveLength(expectedEmployees.length);

            // Check if the result is sorted by days_worked
            for (let i = 0; i < res.body.length - 1; i++) {
                expect(res.body[i].days_worked).toBeGreaterThanOrEqual(res.body[i + 1].days_worked);
            }
        });

        it ("Returns an empty list if cafe doesn't exist", async () => {
            const res = await request(app).get("/employees?cafe=test");
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });

        it ("Returns a list of all employees on the given cafe if provided, still sorted by days worked", async () => {
            const res = await request(app).get("/employees?cafe=Red Espresso");
            expect(res.statusCode).toEqual(200);

            // Check that it gets all the employees working at the given cafe
            expect(res.body).toHaveLength(expectedEmployees.filter((employee) => employee.cafe === 'Red Espresso').length);

            // Check if the result is sorted by days_worked
            for (let i = 0; i < res.body.length - 1; i++) {
                expect(res.body[i].days_worked).toBeGreaterThanOrEqual(res.body[i + 1].days_worked);
            }
        });
    });

    describe('POST /employees', () => {
        it("Returns success message and employee data", async () => {
            const res = await request(app).post("/employees").send(employeeTestData.validEmployee);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({
                id: expect.any(String),
                ...employeeTestData.validEmployee,
                message: "Employee created successfully"
            });
        });

        it("Inserting employee with unexisting cafe should return error", async () => {
            const res = await request(app).post("/employees").send(employeeTestData.invalidEmployee.unexistingCafe);

            expect(res.statusCode).toEqual(404);
        });

        it("Inserting employee with existing email or phone number should return error", async () => {
            const res = await request(app).post("/employees").send(employeeTestData.invalidEmployee.existingPhoneNumber);

            expect(res.statusCode).toEqual(409);
        });

        it("Inserting cafe with empty name, email, phone, or gender should return error", async () => {
            const res = await request(app).post("/employees").send(employeeTestData.invalidEmployee.emptyName);

            expect(res.statusCode).toEqual(400);
        });

        it("Inserting cafe with invalid email should return error", async () => {
            const res = await request(app).post("/employees").send(employeeTestData.invalidEmployee.invalidEmail);

            expect(res.statusCode).toEqual(400);
        });

        it("Inserting cafe with invalid phone number should return error", async () => {
            const res = await request(app).post("/employees").send(employeeTestData.invalidEmployee.invalidEmail);

            expect(res.statusCode).toEqual(400);
        });
    })
});