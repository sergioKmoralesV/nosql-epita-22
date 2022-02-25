const mongoose = require('mongoose');

function getUniques(array) {return Array.from(new Set(array))}

function toObjectID(string) {return mongoose.Types.ObjectId(string)}

module.exports = {
  getUniques,
  toObjectID,
};