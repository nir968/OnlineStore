const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true,
        minlength: 1
      },
      type: {
        type: String,
        required: true,
        enum: ['customer', 'admin', 'supplier']
      },
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      streetAddress: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true}
});

module.exports = mongoose.model('User', User);