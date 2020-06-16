const { Router } = require('express');
const Auction = require('../models/Auction');
const { ensureAuth } = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Auction
      .create(req.body)
      .then(auction => res.send(auction))
      .catch(next);
  })
  
  .get('/:id', ensureAuth, (req, res, next) => {
    Auction
      .findById(req.params.id)
      .populate('user')
      .populate('bids', {
        price: true
      })
      .then(auction => res.send(auction))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Auction
      .find(req.query)
      .populate('user', {
        _id: true
      })
      .then(auctions => res.send(auctions))
      .catch(next);
  });

