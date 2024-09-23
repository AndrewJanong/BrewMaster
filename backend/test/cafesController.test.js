const request = require('supertest');
const app = require('../index'); // Import your Express app
const database = require('../connect_database');
const migrateTestDB = require('./utils/migrateTestDB');

const expectedCafes = require('./fixtures/expectedCafesSorted.json'); // Cafes sorted by number of employees
const cafeTestData = require('./fixtures/cafeTestData');

beforeAll(async () => {
    await migrateTestDB(); // Set up test database
});

afterAll(async () => {
    await database.end();
});


describe('Cafes API', () => {
    describe('GET /cafes?location=<location>', () => {
        it ("Return a list of all cafes sorted by number of employees if location not provided", async () => {
            const res = await request(app).get("/cafes");
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expectedCafes);
        });

        it ("Returns an empty list if location not valid", async () => {
            const res = await request(app).get("/cafes?location=test");
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });

        it ("Returns a list of all cafes on the given location if provided", async () => {
            const res = await request(app).get("/cafes?location=Downtown");
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expectedCafes.filter(cafe => cafe.location === 'Downtown'));
        });
    });

    describe('POST /cafes', () => {
        it("Returns success message and cafe data", async () => {
            const res = await request(app).post("/cafes").send(cafeTestData.validCafe);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({
                id: expect.any(String),
                ...cafeTestData.validCafe,
                message: "Cafe created successfully"
            });
        });

        it("Inserting existing cafe name should return error", async () => {
            const res = await request(app).post("/cafes").send(cafeTestData.invalidCafe.existingName);

            expect(res.statusCode).toEqual(409);
        });

        it("Inserting cafe with empty name, description, or location should return error", async () => {
            const res = await request(app).post("/cafes").send(cafeTestData.invalidCafe.emptyName);

            expect(res.statusCode).toEqual(400);
        });
    });

    describe("PUT /cafes/:id", () => {
        let cafeId;

        it("Returns success message and edited cafe", async () => {
            const beforeRes = await request(app).post('/cafes').send(cafeTestData.beforeUpdateCafe);
            cafeId = beforeRes.body.id; // Store the ID of the created cafe for update test

            // Verify udpated successfully
            const res = await request(app).put(`/cafes/${cafeId}`).send(cafeTestData.updatedCafe);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                id: cafeId,
                ...cafeTestData.updatedCafe,
                message: "Cafe edited successfully"
            });

            // Verify that the changes were applied
            const getRes = await request(app).get(`/cafes?location=Updated Location`);

            expect(getRes.statusCode).toEqual(200);
            expect(getRes.body).toEqual([{
                id: cafeId,
                ...cafeTestData.updatedCafe,
                employees: 0
            }]);
        });

        it("Editing cafe to existing name should return error", async () => {
            const res = await request(app).put(`/cafes/${cafeId}`).send(cafeTestData.invalidCafe.existingName);

            expect(res.statusCode).toEqual(409);
        });

        it("Editing cafe with empty name, description, or location should return error", async () => {
            const res = await request(app).put(`/cafes/${cafeId}`).send(cafeTestData.invalidCafe.emptyName);

            expect(res.statusCode).toEqual(400);
        });
    });


    describe("DELETE /cafes/:id", () => {
        let cafeId;

        if ("Returns success message and deleted cafe id", async () => {
            const cafe = await request(app).post('/cafes').send(cafeTestData.deleteCafe);
            cafeId = cafe.body.id; // Store the ID of the created cafe for deletion test

            const res = await request(app).delete(`/cafes/${cafeId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                message: 'Cafe deleted successfully',
                id: cafeId
            });

            // Verify that the cafe no longer exists
            const getRes = await request(app).get(`/cafes?location=Delete Test Location`);
            expect(getRes.statusCode).toEqual(200);
            expect(getRes.body).toEqual([]);
        });
    });
})
