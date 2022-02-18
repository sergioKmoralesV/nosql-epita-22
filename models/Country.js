const mongoose = require('mongoose');

const Country = mongoose.model('Country', {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isoCode: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = Country;