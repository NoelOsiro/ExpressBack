import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { connectWithRetry } from '../db'; // Update the path if needed
import User from '../models/UserModel';

describe('Authentication Routes', () => {
  beforeAll(async () => {
    const testDbURI = process.env.TEST_DB_URI || ''; 
    await connectWithRetry(testDbURI);
    
    const testUser = await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
      phone: '123-456-7890',
      address: '123 Main St, City',
      sex: 'Male',
      role: 'Doctor',
      verified: false,
    });
  });

  afterAll(async () => {
    await User.deleteMany({ username: 'testuser' });
    await mongoose.connection.close();
  });

  test('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'testpassword',
        phone: '123-456-7890',
        address: '123 Main St, City',
        sex: 'Male',
        role: 'Nurse',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  // Add more test cases for other routes, such as login and verification
});
