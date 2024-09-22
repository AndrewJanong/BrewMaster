const request = require('supertest');
const app = require('../index'); // Import your Express app
const database = require('../connect_database');

const expectedCafes = require('./fixtures/expectedCafes.json');


describe('Cafes API', () => {
    it ("Check that it return a list of all cafes sorted by number of employees", async () => {
        const res = await request(app).get("/cafes");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expectedCafes);
    });

    it ("Check that it returns an empty list if location not valid", async () => {
        const res = await request(app).get("/cafes?location=test");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });

    it ("Check that it returns a list of all cafes on the given location", async () => {
        const res = await request(app).get("/cafes?location=Downtown");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expectedCafes.filter(cafe => cafe.location === 'Downtown'));
    });

    afterAll(async () => {
        await database.end();
    });
})
