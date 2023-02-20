import request from 'supertest';

import app from '../app';

const userDetails = {
  firstName: 'John',
  lastName: 'Koen',
  password: 'password123',
  passwordConfirmation: 'password123',
  email: 'email@me.com'
};
describe('User Tests', () => {
  describe('POST /', () => {
    it('responds with a 200', (done) => {
      request(app).post('/api/v1/users').send(userDetails).expect(200, done);
    });
  });
});
