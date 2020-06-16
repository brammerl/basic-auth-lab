
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
  beforeEach(async() => {
    user = await User.create({
      email: `test@test.com`,
      password: `testpassword`
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it(`creates an auction via POST`, () => {
    return request(app)
      .post(`/api/v1/auctions/`)
      .auth('test@test.com', 'testpassword')
      .send({
        user: user._id,
        title: 'auction title',
        description: 'auction description',
        quantity: 1,
        endDate: Date()
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          title: 'auction title',
          description: 'auction description',
          quantity: 1,
          endDate: expect.anything(),
          __v: 0
        });
      });
  });

  it('gets the auction by id via GET', async() => {
    const auction = await Auction.create({
      user: user._id,
      title: 'auction title',
      description: 'auction description',
      quantity: 1,
      endDate: Date()
    });

    Bid.create({
      auction: auction.id,
      user: user.id,
      price: 10,
      quantity: 1,
      accepted: true
    });

    return request(app)
      .get(`/api/v1/auctions/${auction._id}`)
      .auth('test@test.com', 'testpassword')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          bids: [{
            _id: expect.anything(),
            auction: auction.id,
            price: 10
          }],
          description: auction.description,
          endDate: expect.anything(),
          quantity: auction.quantity,
          title: auction.title,
          user: {
            _id: expect.anything(),
            email: user.email
          },
          __v: 0
        });
      });
  });

  it(`gets all auctions via GET`, async() => {
    await Auction.create({
      user: user._id,
      title: 'auction title',
      description: 'auction description',
      quantity: 1,
      endDate: Date()
    }, 
    {
      user: user._id,
      title: 'auction title2',
      description: 'auction description2',
      quantity: 2,
      endDate: Date()
    });

    return request(app)
      .get('/api/v1/auctions/')
      .auth('test@test.com', 'testpassword')
      .then(res => {
        expect(res.body).toEqual([
          {
            _id: expect.anything(),
            user: {
              _id: user.id
            },
            title: 'auction title',
            description: 'auction description',
            quantity: 1,
            endDate: expect.anything(),
            __v: 0
          }, 
          {
            _id: expect.anything(),
            user: {
              _id: user.id
            },
            title: 'auction title2',
            description: 'auction description2',
            quantity: 2,
            endDate: expect.anything(),
            __v: 0
          }
        ]);
      });
  });
});
