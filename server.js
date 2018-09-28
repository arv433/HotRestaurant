// load express
var express = require("express");
var app = express();
// install body parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var path = require("path");
var PORT = process.env.PORT || 3000;

// Maximum of 5 tables reserved at any time.
var tablesReserved = [];

// Once tablesReserved is filled up with 5 reservations
// waitTables begins taking up a wait list.
var waitTables = [];

// static routes
app.get("/tables", function (req, res) {
    res.sendFile(path.join(__dirname, "app", "pages", "view.html"));
});
app.get("/reserve", function (req, res) {
    res.sendFile(path.join(__dirname, "app", "pages", "make.html"));
});


// JSON GET Routes
app.get("/api/waitlist", function (req, res) {
    console.log(waitTables);
    return res.json(waitTables);
});

app.get("/api/tables", function (req, res) {
    console.log(tablesReserved);
    return res.json(tablesReserved);
});

app.get("/api/reservation/:uniqueId", function (req, res) {
    var uID = req.params.uniqueId;

    console.log(uID);

    for (var i = 0; i < tablesReserved.length; i++) {
        if (uID === tablesReserved[i].uniqueId) {
            console.log("Your seated on table: " + i);
            return res.json(tablesReserved[i]);
        }
    }

    for (var i = 0; i < waitTables.length; i++) {
        if (uID === waitTables[i].uniqueId) {
            console.log("Your position on the waitlist is: " + i);
            return res.json(waitTables[i]);
        }
    }

    return res.json(false);
});

// POST Routes
app.post("/api/reservations", function(req, res) {
    var newReservation = req.body;

    if (tablesReserved.length < 5) {
        tablesReserved.push(newReservation);
        res.json(newReservation);
    } else {
        waitTables.push(newReservation);
        res.json(newReservation);
    }
});
app.post("/api/clear", function(req, res) {
    tablesReserved = [];
    for (var i = 0; waitTables[0] != null && i < 5; i++) {
        tablesReserved.push(waitTables[0]);
        waitTables.shift();
    }
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "app", "pages", "front.html"));
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});