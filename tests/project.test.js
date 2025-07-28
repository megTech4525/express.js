jest.setTimeout(30000); // 30 seconds
// Extend timeout for setup
const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../server'); // or '../app' if you export the express instance separately
const User = require('../models/user.models');
const Client = require('../models/client.model');
const Project = require('../models/project.models');

let mongoServer;
let token;
let clientId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const res = await request(app)
  .post('/api/auth/signup')
  .send({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
  });

token = res.body.token;

  // token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'testsecret', {
    // expiresIn: '1h',
  // });

  const client = await Client.create({
    name: 'Test Client',
    email: 'client@example.com',
  });

  clientId = client._id;
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    if (mongoServer) await mongoServer.stop();
  } catch (err) {
    console.error('Teardown error:', err);
  }
});

// afterAll(async () => {
//   try {
//     await mongoose.connection.dropDatabase();
//     await mongoose.connection.close();
//     await mongoServer.stop();
//   } catch (err) {
//     console.error('Teardown error:', err);
//   }
// });

describe('Project API', () => {
  it('should create a new project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
  name: 'New Project',
  description: 'A test project',
  client: clientId,
});


    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('New Project');
    expect(res.body.clientId).toBe(clientId.toString());
  });
});
