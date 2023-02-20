import request from 'supertest';

import app from '../app';

describe('User Tests', () => {
  describe('POST /', () => {
    it('responds with a 200', (done) => {
      request(app).post('/api/v1/users').expect(200, done);
    });
  });
});
