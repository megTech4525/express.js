const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../server'); // make sure app.js exports the Express app
const Client = require('../models/client.model');
const User = require('../models/user.models');

jest.setTimeout(30000); // <-- extend timeout for setup

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user = await User.create({ username: 'testuser', password: 'password', role: 'user' });

  token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  } catch (err) {
    console.error('Teardown error:', err);
  }
});

describe('Client API', () => {
  it('should create a new client successfully', async () => {
    const res = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Client',
        email: 'client@example.com',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Client');
  });
});
