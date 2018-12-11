'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { SECRET, EXPIRY } = require('../config') 
const router = express.Router();

const createAuthToken = function(user) {

  return jwt.sign({user}, SECRET, {
    subject: user.username,
    expiresIn: EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});
// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.send({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.send({authToken});
});

module.exports = router;