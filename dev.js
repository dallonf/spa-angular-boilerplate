var express = require('express'),
    path = require('path'),

    port = 3000 || process.env['PORT']
    app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, function() {
  console.log("Dev server listening on localhost:" + port);  
});