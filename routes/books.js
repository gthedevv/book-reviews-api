'use strict'
const express = require('express');
const router = express.Router();

const  Book  = require('../models/books'); 

router.get('/book', (req, res) => {
    let id = req.query.id;

    Book.findById(id, (err, doc) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.send(doc)
    })
});

router.get('/', (req, res) => { 

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
    res.status(500).send({message: 'Internal server error'})
  });
});

  router.put('/book/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      res.status(400).send({
        error: 'Request path id and request body id values must match'
      })
    }

    const updated = {}

    const updateableFields = ['name', 'author', 'review', 'pages', 'rating', 'price', 'reviewerId'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });


    Book
    .findByIdAndUpdate(req.params.id, updated, { new: true })
    .then(updatedBook => res.status(200).send({success:true, updatedBook}))
    .catch(err => res.status(500).send({ message: 'Something went wrong' }));
  });

  router.delete('/book/:id', (req, res) => {
    Book
      .findByIdAndRemove(req.params.id)
      .then(() => {
        res.status(204).send({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({ error: 'something went terribly wrong' });
      });
  });

module.exports = router;