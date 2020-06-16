const { Router } = require('express');
const Bid = require('../models/Bid');

module.exports = Router()
  .post('/', (req, res, next) => {
    Bid 
      .create(req.body)
      .then(bid => res.send(bid))
      .catch(next);
  });
