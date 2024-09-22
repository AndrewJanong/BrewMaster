const request = require('supertest');
const app = require('../index'); // Import the app

describe('API Root', () => {
    it('should return a message indicating the API is running', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "API is running" });
    });
});