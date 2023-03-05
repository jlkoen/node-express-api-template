import request from 'supertest';
import app from '../app';
import { connectToDb, closeDbConnection } from '../utils/connectToDb';
import mongoose from 'mongoose';
import UserModel, { User } from './user.model';
import { findUserByEmail } from './user.service';
import { faker } from '@faker-js/faker';

const getUserDetails = () => {
  const userDetails = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: 'password123',
    passwordConfirmation: 'password123',
    email: faker.internet.email()
  };
  return userDetails;
};

beforeAll(async () => {
  await connectToDb();
  jest.setTimeout(30000);
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
      const userDetails = getUserDetails();
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.status).toEqual(200);
      expect(response.text).toEqual('User successfully created');
    });

    it('responds with an error when account already exists', async () => {
      const userDetails = getUserDetails();
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);

      const secondResponse = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(secondResponse.status).toEqual(409);
      expect(secondResponse.text).toEqual('Account already exists');
    });

    it('ensures password is encrypted in the database', async () => {
      const userDetails = getUserDetails();
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      const userList = (await findUserByEmail(userDetails.email)) as User;
      expect(userList.password).not.toEqual(userDetails.password);
    });

    it('returns error when first name is missing', async () => {
      const userDetails = getUserDetails();
      userDetails.firstName = '';
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.body.name).toEqual('ValidationError');
    });

    it('returns error when last name is missing', async () => {
      const userDetails = getUserDetails();
      userDetails.lastName = '';
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.body.name).toEqual('ValidationError');
    });

    it('returns error when password is missing', async () => {
      const userDetails = getUserDetails();
      userDetails.password = '';
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.body[0].code).toEqual('too_small');
    });

    it('returns error with password containing too few characters', async () => {
      const userDetails = getUserDetails();
      userDetails.password = '123';
      userDetails.passwordConfirmation = '123';
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.body[0].code).toEqual('too_small');
    });

    it('returns error when passwords do not match', async () => {
      const userDetails = getUserDetails();
      userDetails.password = 'password123';
      userDetails.passwordConfirmation = 'Password123';
      const response = await request(app)
        .post('/api/v1/users')
        .send(userDetails);
      expect(response.body[0].message).toEqual('Passwords do not match');
    });
  });

  describe('Verify a User', () => {
    it('successfully verifies a user with the correct verificationcode', async () => {
      const userDetails = getUserDetails();
      const createUserResponse = await request(app)
        .post('/api/v1/users')
        .send(userDetails);

      const userList = (await findUserByEmail(userDetails.email)) as User;
      const verificationCode = userList.verificationCode;
      // @ts-ignore
      const myuserId = userList._id;
      const validateUserResponse = await request(app).post(
        `/api/v1/users/verify/${myuserId}/${verificationCode}`
      );

      // expect(response.status).toBe(200);
      expect(validateUserResponse.text).toEqual('User successfully verified');
    });

    it('returns an error when verifying a user with an incorrect verificationcode', async () => {
      const userDetails = getUserDetails();
      const createUserResponse = await request(app)
        .post('/api/v1/users')
        .send(userDetails);

      const userList = (await findUserByEmail(userDetails.email)) as User;
      const verificationCode = 'myincorrectcode';
      // @ts-ignore
      const myuserId = userList._id;
      const validateUserResponse = await request(app).post(
        `/api/v1/users/verify/${myuserId}/${verificationCode}`
      );

      expect(validateUserResponse.status).toBe(400);
      expect(validateUserResponse.text).toEqual('Could not verify user');
    });

    it('returns an error when verifying an invalid user', async () => {
      const userDetails = getUserDetails();
      const createUserResponse = await request(app)
        .post('/api/v1/users')
        .send(userDetails);

      const userList = (await findUserByEmail(userDetails.email)) as User;
      const verificationCode = 'myincorrectcode';
      // @ts-ignore
      const myuserId = '6404e5cb1d2f87e043800000';
      const validateUserResponse = await request(app).post(
        `/api/v1/users/verify/${myuserId}/${verificationCode}`
      );

      expect(validateUserResponse.status).toBe(400);
      expect(validateUserResponse.text).toEqual('Could not verify user');
    });
  });
});
