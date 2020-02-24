const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/REI-reviews', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', () => { console.log('db connection up') });
module.exports = db;