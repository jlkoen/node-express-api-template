import request from 'supertest';

import app from './app';

describe('App', () => {
  describe('GET /', () => {
    it('responds with Hello World!', (done) => {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, { message: 'Hello World!' }, done);
    });
  });
});
