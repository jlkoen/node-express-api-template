import request from 'supertest';

import app from '../app';
import { connectToDb, closeDbConnection } from '../utils/connectToDb';

const userDetails = {
  firstName: 'John',
  lastName: 'Koen',
  password: 'password123',
  passwordConfirmation: 'password123',
  email: 'email@me.com'
};

beforeEach(async () => {
  await connectToDb();
});

afterAll(async () => {
  await closeDbConnection();
});

describe('User Tests', () => {
  describe('Create a User', () => {
    it('responds with a 200', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails)
        .expect(200);
    });
  });
});
