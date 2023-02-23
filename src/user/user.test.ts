import request from 'supertest';
import app from '../app';
import { connectToDb, closeDbConnection } from '../utils/connectToDb';
import UserModel, { User } from './user.model';

const userDetails = {
  firstName: 'John',
  lastName: 'Koen',
  password: 'password123',
  passwordConfirmation: 'password123',
  email: 'email@me.com'
};

beforeAll(async () => {
  await connectToDb();
});
beforeEach(async () => {
  await UserModel.deleteMany();
});

afterAll(async () => {
  await closeDbConnection();
});

describe('User Tests', () => {
  describe('Create a User', () => {
    it('responds with a 200', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.status).toEqual(200);
      expect(response.text).toEqual('User successfully created');
    });

    it('returns error when first name is missing', async () => {
      userDetails.firstName = '';
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.body.name).toEqual('ValidationError');
    });

    it('returns error when last name is missing', async () => {
      userDetails.lastName = '';
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.body.name).toEqual('ValidationError');
    });

    it('returns error when password is missing', async () => {
      userDetails.password = '';
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.body[0].code).toEqual('too_small');
    });

    it('returns error with password containing too few characters', async () => {
      userDetails.password = '123';
      userDetails.passwordConfirmation = '123';
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.body[0].code).toEqual('too_small');
    });

    it('returns error when passwords do not match', async () => {
      userDetails.password = 'password123';
      userDetails.passwordConfirmation = 'Password123';
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.body[0].message).toEqual('Passwords do not match');
    });
  });
});
