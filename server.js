'use strict';
require('dotenv').config();
const { DATABASE, PORT } = require('./config').get(process.env.NODE_ENV);
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');

const users = require('./routes/users');
const books = require('./routes/books');
const auth = require('./routes/auth');
const { localStrategy, jwtStrategy } = require('./middleware/stratagies');

const app = express(); 

mongoose.Promise = global.Promise;

// middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

// handle routes
app.use('/auth', auth);
app.use('/users', users);
app.use('/books', books);

// handle server
let server;

function runServer(databaseUrl, port) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE, PORT).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };