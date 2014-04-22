var mongoose = require('mongoose');

var incentiveSchema = new mongoose.Schema({
  name: String,
  description: String
});

module.exports = mongoose.model('Incentive', incentiveSchema);
