'use strict'
require('dotenv').config();
const { SECRET, EXPIRY } = require('../config').get(process.env.NODE_ENV);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        maxlength: 50
    },
    lastname: {
      type: String,
      required: true,
      maxlength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true

    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: Number,
        default: 0
    },
    created_date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

UserSchema.virtual('name').get(function() {
    return `${this.firstname} ${this.lastname}`.trim();
  });

UserSchema.methods.serialize = function() {
    return {
        success: true,
        user: { 
            name: this.name,
            email: this.email,
            role: this.role,
            created_date: this.created_date
        }
    }
}

UserSchema.statics.findUserByEmail = function(email) {
    return this.findOne({
        'email': email
    });
}

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
}

UserSchema.methods.createAuthToken = function(payload) {
  return jwt.sign({payload}, SECRET, {
        subject: payload.email,
        expiresIn: EXPIRY,
        algorithm: 'HS256'
      });  
}

const User = mongoose.model('users', UserSchema); 

module.exports = { User } 