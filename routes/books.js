'use strict'
const express = require('express');
const passport = require('passport');

const router = express.Router();

const  Book  = require('../models/books'); 

const jwtAuth = passport.authenticate('jwt', { session: false });

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
  let {skip, limit, order} = req.query
  skip = parseInt(skip);
  limit = parseInt(limit);

  Book.find()
    .skip(skip)
    .sort({_id:order})
    .limit(limit)
    .then((err, docs) => {
      if(err) {
        return res.status(400).send(err);
      }
      res.send(docs)
    })
    .catch(err => {
      return res.status(500).send(err);
    })
});

router.get('/user_reviews/:id', jwtAuth, (req, res) => {
  const { id: reviewerId } = req.params
  console.log(reviewerId)
  Book.find({reviewerId})
    .then(bookReviews => {
      return res.status(200).send(bookReviews)
    }) 
    .catch(err => {
      console.log(err)
      return res.sendStatus(404);
    })
});

router.post('/book', jwtAuth, (req, res) => {
  const { name, author, review, pages, rating, price, reviewerId } = req.body

  const requiredFields = ['name', 'author', 'review', 'pages', 'rating', 'price', 'reviewerId']
  const missingFields = [];
  requiredFields.forEach(field => {
    if(!(field in req.body)) {
      missingFields.push(field);
    }
  }); 

  const message = `You are missing ${missingFields.join(', ')}`;

  if(!(missingFields === undefined || missingFields == 0)) {
    return res.status(422).send({
      code: 422,
      reason: 'ValidationError',
      message
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
  .then(doc => {
    return res.status(201).send(doc.bookPosted())
  })
  .catch(err => {
    console.error(err);
    return res.status(500).send(err);
  });
});

  router.put('/book/:id', jwtAuth, (req, res) => {
    if (!(req.body.id)) {
      return res.status(400).send({
        error: 'Request body id missing'
      });
    } else if (!(req.params.id === req.body.id)) {
      return res.status(400).send({
        error: 'Request path id and request body id values must match'
      });
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
    .then(updatedBook =>{
      return res.status(200).send({success:true, updatedBook}) 
    })
    .catch(err => {
      return res.status(500).send(err)
    });
  });

  router.delete('/book/:id', jwtAuth, (req, res) => {
    Book
      .findByIdAndRemove(req.params.id)
      .then(() => {
        res.status(204).send({ message: 'success' });
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  });

module.exports = router;