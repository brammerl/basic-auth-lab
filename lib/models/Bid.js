const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  accepted: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Bid', schema);
