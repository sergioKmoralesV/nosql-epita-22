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
  population: {
    type: Number,
    required: true,
  },
  continent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Continent'
  }
});

module.exports = Country;