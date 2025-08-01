const request = require('supertest');
const app = require('../app');
const sql = require('mssql');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      ic: 'S1111111D',
      phone: '88888888',
      pin: '1234'
    });

  expect(res.statusCode).toBe(200);
  token = res.body.token;
});

describe('Accessibility Preferences API', () => {
  test('should update user accessibility preferences', async () => {
    const res = await request(app)
      .put('/accessibility/accessibility-settings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fontSize: 'large',
        contrastLevel: 80,
        darkMode: true
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBeDefined();
  });

  test('should fetch updated accessibility preferences', async () => {
    const res = await request(app)
      .get('/accessibility/accessibility-settings')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.fontSize).toBe('large');
    expect(res.body.darkMode).toBe(true);
  });

  test('should block access without token', async () => {
    const res = await request(app)
      .get('/accessibility/accessibility-settings');

    expect(res.statusCode).toBe(401); 
  });
});

afterAll(async () => {
  await sql.close();
});
