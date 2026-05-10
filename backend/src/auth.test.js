const request = require('supertest');
const app = require('./index');

beforeAll(async () => {
  await request(app).post('/auth/register').send({ username: 'alice', password: 'secret' });
});

test('valid credentials return a token', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ username: 'alice', password: 'secret' });
  expect(res.status).toBe(200);
  expect(res.body.token).toBeTruthy();
});

test('wrong password returns 401', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ username: 'alice', password: 'wrong' });
  expect(res.status).toBe(401);
});
