const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },

  passwordHash: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v,
      delete ret.passwordHash;
    }
  }
});

schema.virtual(`password`).set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS || 8);
});

schema.virtual('bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'user'
});

schema.virtual('auctions', {
  ref: 'Auction',
  localField: '_id',
  foreignField: 'user'
});
module.exports = mongoose.model('User', schema);
