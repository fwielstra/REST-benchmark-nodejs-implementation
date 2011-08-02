var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = express.createServer();

var connection = mongoose.connect('mongodb://localhost/performance-contest');

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

var RestModel = mongoose.model('Rest',new Schema({
     id: Number,
     shortStringAttribute: String,
     longStringAttribute: String,
     intNumber: Number,
     trueOrFalse: Boolean
}));

function get(id, callback) {
   RestModel.find({id: id}, function(error, result) {
       callback(error, result[0]);
   });
}

app.get('/rest/get/:id', function(req, res) {
    var result = get(req.params.id, function(error, result) {
        if (error) res.send('Thingy with Id not found', 404);
        else res.send(result);        
    });
});
/*
curl -H 'Content-Type: application/json' -d '{"id": 4, "shortStringAttribute": "bla4","longStringAttribute": "bla bla bla4","intNumber": 1004, "trueOrFalse": false}' http://localhost:3000/rest/put/4
 */
app.post('/rest/put/:id', function(req, res) {
    if (req.body.id != req.params.id) {
        res.send('ID mismatch', 409);
    } else {
        get(req.body.id, function(error, result) {
            if (error || !result) {
                new RestModel(req.body).save();
            } else {
                result.set(req.body);
                result.save();
            }
            res.send(200);
        });        
    }
});

// start the server.
app.listen(3000);

console.log("Express server listening on port %d", app.address().port);
console.log("Settings: ", app.settings);