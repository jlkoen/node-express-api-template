import request from 'supertest';

import app from './app';

describe('Main App Tests', () => {
  describe('GET /healthcheck', () => {
    it('responds with a 200', (done) => {
      request(app).get('/api/v1/healthcheck').expect(200, done);
    });
  });
});
