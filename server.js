var database_uri= 'mongodb+srv://gp07101:gp0710@cluster0.uw3ng.mongodb.net/Cluster0?retryWrites=true&w=majority'


// init project
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var app = express();
var port = process.env.PORT || 3000;

mongoose.connect(database_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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

app.get("/urlShortener", function(req, res) {
  res.sendFile(__dirname + '/views/urlShortener.html');
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({greeting: 'hello API'});
});

//url Shortener
const ShortURL = mongoose.model('ShortURL', new mongoose.Schema({
  short_url: String,
  original_url: String,
  suffix: String
}));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

var jsonParser = bodyParser.json()

app.post('/api/shorturl', function(req, res) {

  let request_url = req.body.url;
  let suffix = shortid.generate();
  let shorterURL = suffix;
  // create user in req.body

  let newURL = new ShortURL({
    short_url: __dirname + "/api/shorturl/" + suffix,
    original_url: request_url,
    suffix: suffix
  })

    newURL.save(function(err, doc) {
      if (err) return console.error(err);
      console.log("Document inserted successfully");
      res.json({
        "saved": true,
        "short_url": newURL.short_url,
        "original_url": newURL.original_url,
        "suffix": newURL.suffix
    });
  });
});

app.get("/api/shorturl/:suffix", function(req, res) {
  let generatedSuffix = req.params.suffix;
  ShortURL.find({suffix: generatedSuffix}).then(function(foundUrls) {
    let urlRedirect = foundUrls[0];
    res.redirect(urlRedirect.original_url);
  });
});


//header request
app.get("/api/whoami", function(req, res) {

  res.json({
    "ipaddress": req.connection.remoteAddress,
    "language": req.headers["accept-language"],
    "software": req.headers["user-agent"]
  })
});

//timestamp microservice

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
