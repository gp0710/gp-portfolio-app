// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/timestamp_microservice", function(req, res) {
  res.sendFile(__dirname + '/views/timestamp_microservice.html');
});

app.get("/headerParserReq", function(req, res) {
  res.sendFile(__dirname + '/views/headerParserReq.html');
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/whoami", function(req, res) {

  res.json({
    "ipaddress": req.connection.remoteAddress,
    "language": req.headers["accept-language"],
    "software": req.headers["user-agent"]
  })
});

app.get("/api/:date", function(req, res) {
  let dateParam = req.params.date;
  if (dateParam.match(/\d{5,}/)){
    dateParam = +dateParam;
  }
  let time = new Date(dateParam);
  if (time.toUTCString() === "Invalid Date") {
    res.json({
      "error": time.toUTCString()
    });
  }
  res.json({
    "unix": time.valueOf(),
    "utc": time.toUTCString()
  });
});

app.get("/api/", function(req, res) {
  let time = new Date();
  res.json({
    "unix": time.valueOf(),
    "utc": time.toUTCString()
  })
});

// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
