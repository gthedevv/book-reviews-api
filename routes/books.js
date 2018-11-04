'use strict'
const express = require('express');
const router = express.Router();

const { Book } = require('../models/books'); 

router.get('/book', (req, res) => {
    let id = req.query.id;

    Book.findById(id, (err, doc) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.send(doc)
    })
});

router.get('/books', (req, res) => { 
  let skip = parseInt(req.query.skip);
  let limit = parseInt(req.query.limit);
  let order = req.query.order;

  Book.find()
    .skip(skip)
    .sort({_id:order})
    .limit(limit)
    .exec((err, docs) => {
      if(err) {
        return res.status(400).send(err);
      }
      res.send(docs)
    })
});

router.post('/book', (req, res) => {
  const { name, author, review, pages, rating, price, reviewerId } = req.body

    const requiredFields = ['name', 'author', 'review', 'pages', 'rating', 'price', 'reviewerId']
    const missingField = requiredFields.find(field => !(field in req.body))

    if(missingField) {
      return res.status(422).send({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      });
    }

    Book.create({
      name,
      author,
      review,
      pages,
      rating,
      price,
      reviewerId
    })
    .then(doc => res.status(201).send(doc.bookPosted()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'})
    });
  });

module.exports = router;