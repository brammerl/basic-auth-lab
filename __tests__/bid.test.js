
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Auction = require('../lib/models/Auction');
const User = require('../lib/models/User');
const Bid = require('../lib/models/Bid');

describe('auth routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  let auction;
  let bid;
  beforeEach(async() => {
    user = await User.create({
      email: `test@test.com`,
      password: `testpassword`
    });

    auction = await Auction.create({
      user: user._id,
      title: 'auction title',
      description: 'auction description',
      quantity: 1,
      endDate: Date()
    });

    bid = await Bid.create({
      auction: auction.id,
      user: user._id,
      price: 10,
      quantity: 1,
      accepted: true
    });

  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a bid via POST', () => {
    return request(app)
      .post(`/api/v1/bids/`)
      .send({
        auction: auction._id,
        user: user._id,
        price: 10,
        quantity: 1,
        accepted: true
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.anything(),
          auction: auction.id,
          user: user.id,
          price: 10,
          quantity: 1,
          accepted: true
        });
      });
  });

  it('gets by id via GET', async() => {
    return request(app)
      .get(`/api/v1/bids/${bid._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          auction: auction.id,
          user: user.id,
          price: 10,
          quantity: 1,
          accepted: true,
          __v: 0
        });
      });
  });
    
});
