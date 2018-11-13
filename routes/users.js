'use strict'
const express = require('express');
const router = express.Router();

const  User  = require('../models/users'); 

router.get('/', (req, res) => {
    User
        .find()
        .limit(100)
        .then(users => {
            return res.status(200).send(users);
        })
        .catch(err => {
            return res.status(400).send(err);
        })

});

router.get('/getReviewer/:id', (req, res) => {
    User.findById(req.params.id)
    .then(reviewer => {
        const { firstname, lastname } = reviewer;
        return res.status(200).send({
            firstname,
            lastname
        });
    })
    .catch(err => {
        return res.status(400).send(err);
    })
});

router.get('/user_posts', (req, res) => {
    
});

router.post('/register', (req, res) => {
    let { firstName, lastName, username, password } = req.body 

    const requiredFields = ['firstName', 'lastName', 'username', 'password']
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

    const stringFields = ['username', 'password', 'firstName', 'lastName'];
    const nonStringField = stringFields.find(
      field => field in req.body && typeof req.body[field] !== 'string'
    );
 
    if (nonStringField) {
      return res.status(422).send({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField
        });
    }  

    const explicityTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
      field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
      return res.status(422).send({
        code: 422,
        reason: 'ValidationError',
        message: 'Cannot start or end with whitespace',
        location: nonTrimmedField
      });
    }

    const sizedFields = {
      username: {
        min: 1
      },
      password: {
        min: 10,
        max: 72
    }
    };
    const tooSmallField = Object.keys(sizedFields).find(
      field =>
        'min' in sizedFields[field] &&
              req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
      field =>
        'max' in sizedFields[field] &&
              req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
    return res.status(422).send({
      code: 422,
      reason: 'ValidationError',
        message: tooSmallField
          ? `Must be at least ${sizedFields[tooSmallField]
            .min} characters long`
          : `Must be at most ${sizedFields[tooLargeField]
            .max} characters long`,
        location: tooSmallField || tooLargeField
    });
  }

    firstName = firstName.trim();
    lastName = lastName.trim();
  
    return User.find({username})
      .count()
      .then(count => {
        if (count > 0) {
          return Promise.reject({
            code: 422,
            reason: 'ValidationError',
            message: 'username already used',
            location: 'username'
            });
      }
        return User.hashPassword(password);
      })
      .then(hash => {
        return User.create({
          username,
          password: hash,
          firstName,
          lastName
            });
      })
      .then(user => {
        return res.status(201).send(user.serialize());
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).send(err);
  }   
        console.log(err);
        res.status(500).send(err);
      });
});

module.exports = router;