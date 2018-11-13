'use strict'

const config = {
  production: {
    DATABASE: 'mongodb://gerard:gfajardo0@ds151863.mlab.com:51863/my-book-reviews',
    PORT: process.env.PORT || 5000,
    SECRET: process.env.JWT_SECRET,
    EXPIRY: process.env.JWT_EXPIRY || '1d'
  },
  default:{
    DATABASE: 'mongodb://localhost:27017/myBookReviews',
    PORT: process.env.PORT || 5000,
    SECRET: process.env.JWT_SECRET,
    EXPIRY: process.env.JWT_EXPIRY || '1d'
  }
}

exports.get = function get(env){
  return config[env] || config.default
}