const request = require('supertest');
const app = require('../app');
const sql = require('mssql');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ ic: 'S1234567D', phone: '87666481', pin: '1234' });

  expect(res.statusCode).toBe(200);
  token = res.body.token;
});

describe('Nearby Clinics API', () => {
  test('should return a list of clinics', async () => {
    const res = await request(app)
      .get('/clinics'); 

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('address');
    expect(res.body[0]).toHaveProperty('region');
  });
});

afterAll(async () => {
  await sql.close();
});
