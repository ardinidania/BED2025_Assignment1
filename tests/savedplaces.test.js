const request = require('supertest');
const app = require('../app');
const sql = require('mssql');

let token;
let savedPlaceId;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ ic: 'S1111111D', phone: '88888888', pin: '1234' });

  expect(res.statusCode).toBe(200);
  token = res.body.token;
});

describe('Saved Places API', () => {
  test('should create a new saved place (or find existing)', async () => {
    const res = await request(app)
      .post('/saved-places')
      .set('Authorization', `Bearer ${token}`)
      .send({
        label: 'Hospital',
        address: '123 Health Street',
        phone: '98765432'
      });

    expect([201, 409]).toContain(res.statusCode);

    const listRes = await request(app)
      .get('/saved-places')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);

    const existingPlace = listRes.body.find(place => place.label === 'Hospital');
    savedPlaceId = existingPlace.id;
  });

  test('should get saved places list', async () => {
    const res = await request(app)
      .get('/saved-places')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('should update a saved place', async () => {
    const res = await request(app)
      .put(`/saved-places/${savedPlaceId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        label: 'Polyclinic',
        address: '123 Health Street'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('updated');
  });

  test('should delete a saved place', async () => {
    const res = await request(app)
      .delete(`/saved-places/${savedPlaceId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('deleted');
  });

  test('should block access without token', async () => {
    const res = await request(app)
      .get('/saved-places');

    expect(res.statusCode).toBe(401);
  });
});

afterAll(async () => {
  await sql.close();
});
