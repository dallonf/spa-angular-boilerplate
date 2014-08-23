var express = require('express'),
    bodyParser = require('body-parser');

var api = express.Router();

module.exports = express.Router()
  .use('/api/v1', api);

api.get('/name', function(req, res) {
  res.json({ name: "Universe" });
});