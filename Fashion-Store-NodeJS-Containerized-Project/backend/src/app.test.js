process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';

// Replace the real database module with a fake
jest.mock('./config/db', () => ({
  pool: { query: jest.fn() },
  testConnection: jest.fn(),
}));

jest.spyOn(console, 'error').mockImplementation(() => {})

const request = require('supertest');
const { pool } = require('./config/db');
const app = require('./app');

test('/api/health is 200 even when the database fails', async () => {
  pool.query.mockRejectedValue(new Error('database down'));
  const res = await request(app).get('/api/health');
  expect(res.status).toBe(200);
});

test('/api/ready is 200 when the database answers', async () => {
  pool.query.mockResolvedValue([[{}]]);
  const res = await request(app).get('/api/ready');
  expect(res.status).toBe(200);
});

test('/api/ready is 503 when the database fails', async () => {
  pool.query.mockRejectedValue(new Error('database down'));
  const res = await request(app).get('/api/ready');
  expect(res.status).toBe(503);
});

test('the cart needs a login token', async () => {
  const res = await request(app).get('/api/cart');
  expect(res.status).toBe(401);
});