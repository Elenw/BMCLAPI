var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var settings = require('./settings');

mongoose.connect('mongodb://' + settings.mongoose.host + '/' + settings.mongoose.db, {
  server: {poolSize: 50}
});

module.exports = mongoose;