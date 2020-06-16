const { Router } = require('express');
const Bid = require('../models/Bid');

module.exports = Router()
  .post('/', (req, res, next) => {
    Bid 
      .create(req.body)
      .then(bid => res.send(bid))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Bid
      .findById(req.params.id)
      .then(bid => res.send(bid))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Bid
      .findByIdAndDelete(req.params.id)
      .then(bid => res.send(bid))
      .catch(next);
  });
