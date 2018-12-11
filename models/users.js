'use strict'
require('dotenv').config();
const { SECRET, EXPIRY } = require('../config') 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 50
    },
    username: {
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
    return `${this.firstName} ${this.lastName}`.trim();
  });

UserSchema.methods.serialize = function() {
    return {
        success: true,
        user: { 
            name: this.name,
            username: this.username,
            role: this.role,
            created_date: this.created_date
        }
    }
}

UserSchema.statics.findUserByusername = function(username) {
    return this.findOne({
        'username': username
    });
}

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
}

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};


const User = mongoose.model('users', UserSchema); 

module.exports =  User; 