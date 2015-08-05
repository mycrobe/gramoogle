var express = require('express'),
  fs = require('fs');

var app = express();

app.use(express.static('.'));

app.listen(8080);