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


// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date", function(req, res) {
  let date = req.params.date;
  console.log(date);
  res.json({
    error : "Invalid Date"
  });
});

/* app.get("/api/:date", function(req, res) {
  var now = new Date();
  res.json({
    "unix": now.getTime(),
    "utc": now.toUTCString()
  });
});

app.get("/api/:date", function(req, res) {
  let dateString = req.params.date;
  let newDateString = parseInt(dateString);

  if (newDateString > 10000) {
    let unixTime = new Date(newDateString);
    res.json({
      "unix": unixTime.getTime(),
      "utc": unixTime.toUTCString()
    });
  }

  let timeValue = new Date(dateString);

  if (timeValue == "Invalid Date") {
    res.json({ "error": "Invalid Date" });
  } else {
    res.json({
      "unix": timeValue.getTime(),
      "utc": timeValue.toUTCString()
    })
  }
});
*/
// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
