var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = 'contacts';
var LANDMARKS_COLLECTION = 'Landmarks';

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var db;

var connectie = process.env.MONGODB_URI;
var connectie = "mongodb://localhost:27017/Tapio"
mongodb.MongoClient.connect(connectie, function(err, database){
    if(err){
        console.log(err);
        process.exit(1);
    }

    db = database;
    console.log("Database connection ready");

    var server = app.listen(process.env.PORT || 8080, function(){
        var port = server.address().port;
        console.log("App now running on port" + port)
    })
});

function handleError(res, reason, message, code){
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error" : message});
}

app.get('/api/landmarks', function(req, res) {
    db.collection(LANDMARKS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err){
            handleError(res, err.message, "Failed to get contacts.");
        }else{
            res.status(200).json({"landmarks":docs});
        }
    });
});

app.post('/api/landmarks', function(req, res) {
    var newLandmark = req.body;
    newLandmark.createDate = new Date();

    if (!(req.body.Naam || req.body.Locatie)){
        handleError(res, "Invalid user input", "Must provide a name and discription", 400);
    }

    db.collection(LANDMARKS_COLLECTION).insertOne(newLandmark, function (err, doc) {
        if (err){
            handleError(res, err.message, "Failed to create new contact.");
        }else {
            res.status(201).json({"message":"Successfully created landmark"});
        }
    });
});


app.get('/api/landmarks/short', function(req, res) {
    db.collection(LANDMARKS_COLLECTION).find({
    },{
        "Type": 1,
        "Locatie" : 1
    }).toArray(function (err, docs) {
        if (err){
            handleError(res, err.message, "Failed to get contacts.");
        }else{
            res.status(200).json(docs);
        }
    });
});

app.get('/api/landmark/:id', function(req, res) {
    db.collection(LANDMARKS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err){
            handleError(res, err.message, "Failed to get contacts.");
        }else{
            res.status(200).json({"landmarks":docs});
        }
    });
});
