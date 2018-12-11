'use strict';
exports.DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/myBookReviews';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/myBookReviews';
exports.PORT = process.env.PORT || 5000;
exports.SECRET = process.env.JWT_SECRET;
exports.EXPIRY = process.env.JWT_EXPIRY || '7d';