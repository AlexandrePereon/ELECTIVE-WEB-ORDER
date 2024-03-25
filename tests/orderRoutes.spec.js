import { expect } from 'chai';
import request from 'supertest';
import { before, describe, it } from 'mocha';
import app from '../server.js';
import User from '../models/userModel.js';

const userData = {
  username: 'johnDoe123',
  email: 'john.doe@example.com',
  password: 'SecurePassword123!',
};

describe('POST /api/register', () => {
  before((done) => {
    // delete the test user from the database
    User.deleteOne({
      email: userData.email,
    }).then(() => {
      done();
    });
  });

  it('should register a new user and return the user ID', async () => {
    const response = await request(app).post('/api/register').send(userData);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('id');
  });

  it('should return an error if the user already exists', async () => {
    const response = await request(app).post('/api/register').send(userData);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
  });
});

describe('POST /api/login', () => {
  it('should log in an existing user and return the user token', async () => {
    const response = await request(app).post('/api/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });

  it('should return an error if the user does not exist', async () => {
    const response = await request(app).post('/api/login').send({
      email: 'error@email.com',
      password: 'errorPassword',
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
  });
});
