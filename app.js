var express = require('express'),
    path = require('path'),
    port = 8080 || process.env['PORT']
    app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(require('./api/api'));

app.listen(port, function() {
  console.log("Production server listening on localhost:" + port);
});