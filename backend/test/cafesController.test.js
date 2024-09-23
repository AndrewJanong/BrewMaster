const request = require('supertest');
const app = require('../index'); // Import your Express app
const database = require('../connect_database');
const migrateTestDB = require('./utils/migrateTestDB');

const expectedCafes = require('./fixtures/expectedCafesSorted.json'); // Cafes sorted by number of employees

beforeAll(async () => {
    await migrateTestDB(); // Set up test database
});

afterAll(async () => {
    await database.end();
});


describe('Cafes API', () => {
    it ("GET /cafes return a list of all cafes sorted by number of employees", async () => {
        const res = await request(app).get("/cafes");
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expectedCafes);
    });

    it ("GET /cafes?location=<location> returns an empty list if location not valid", async () => {
        const res = await request(app).get("/cafes?location=test");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });

    it ("GET /cafes?location=<location> returns a list of all cafes on the given location", async () => {
        const res = await request(app).get("/cafes?location=Downtown");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expectedCafes.filter(cafe => cafe.location === 'Downtown'));
    });
})
