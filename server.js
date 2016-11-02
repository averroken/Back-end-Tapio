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

mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database){
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

app.get('/contacts', function(req, res) {
    db.collection(CONTACTS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err){
            handleError(res, err.message, "Failed to get contacts.");
        }else{
            res.status(200).json(docs);
        }
    });
});

app.post('/contacts', function(req, res) {
    var newContact = req.body;
    newContact.createDate = new Date();

    if (!(req.body.firstName || req.body.lastName)){
        handleError(res, "Invalid user input", "Must provide a first or last name", 400);
    }

    db.collection(CONTACTS_COLLECTION).insertOne(newContact, function (err, doc) {
        if (err){
            handleError(res, err.message, "Failed to create new contact.");
        }else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/contacts/id/:id", function(req, res) {
    db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get contact");
        } else {
            res.status(200).json(doc);
        }
    });
});

// app.put('/contacts/:id', function (req, res) {
//     var updateDoc = req.body;
//     delete updateDoc._id;
//
//     db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function (err, doc) {
//         if (err){
//             handleError(res, err.message, "Failed to update contact");
//         }else{
//             res.status(204).end
//         }
//     })
// });

// app.delete('/contacts/:id', function (req, res) {
//
// });

app.get('/firstName/:firstName', function (req, res) {
    db.collection(CONTACTS_COLLECTION).findOne({firstName: req.params.firstName}, function(err, doc) {
        if(err){
            handleError(res, err.message, "Failed to get contact");
        }else {
            res.status(200).json(doc);
        }
    });
});

app.get('/api/landmarks', function(req, res) {
    db.collection(LANDMARKS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err){
            handleError(res, err.message, "Failed to get contacts.");
        }else{
            res.status(200).json(docs);
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
            res.status(201).json(doc.ops[0]);
        }
    });
});

// [
//     {
//         "Naam": "Mijn derde Landmark",
//         "Description": "Blablabla",
//         "Type": "Natuur",
//         "Afstand": 845,
//         "Locatie": [
//             {
//                 "lon": 54,
//                 "lat": 52
//             }
//         ],
//         "ImageURLBig": "https://www.google.be/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiM_rr9m4jQAhVFaxQKHTmWASsQjRwIBw&url=https%3A%2F%2Fplay.goog.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dde.lotumapps.vibes&psig=AFQjCNGUoaqgYXl2i0s9isnDCpTZaaBt1g&ust=1478112412918875",
//         "Visits": 28,
//         "Likes": 35
//     }
// ]