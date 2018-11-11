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

router.post('/register', async (req, res) => {

    const { firstname, lastname, email, password } = req.body 

    const requiredFields = ['firstname', 'lastname', 'email', 'password']
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

 
    let user = await User.findUserByEmail(email);
    if(user) {
        return res.status(400).send({email: 'Email already exists'});
    } else {
        const hash = await User.hashPassword(password);
        User.create({
            firstname,
            lastname,
            email,
            password: hash
        })
        .then(user => {
            return res.status(201).send(user.serialize());
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send(err);
        });
    }  
});

router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  const requiredFields = ['email', 'password']
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

  try {
      const user = await User.findUserByEmail(email);
      if(!user) {
          return res.status(404).send({
              success: false,
              email: 'User not found'
            });
      }

      const verified = await user.checkPassword(password, user.password);
      if(verified) {
          const authToken = await user.createAuthToken(user);
          res.send({
              success: true,
              authToken: 'Bearer ' + authToken
          });
      } else {
          return res.status(400).send({
              success: false, 
              password: 'Password incorrect' 
            });
      }
  } catch(error){
      console.log(error);
  }   
});

module.exports = router;