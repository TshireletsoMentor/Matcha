const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
const dbname = "Matcha";
const options = { useNewUrlParser: true, useUnifiedTopology: true};
const client = MongoClient(url, options);

module.exports = client;