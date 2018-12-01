var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/mydb";
var dbName='mydb';
var collectionName='sudoku'; // sudoku_grids


/* GET home page. Oh look, we're using Express! 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

// CRUD
// Create new
router.post('/sudoku', function(req, res, next) {
  // json is req.body
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection(collectionName).insertOne(req.body, function(err, dbres) {
      if (err) throw err;
      res.send({id:dbres.insertedId});
      console.log("object inserted, id:"+dbres.insertedId);
      db.close();
    });
  }); 
});
// Read one - see also search / find further down
router.get('/sudoku/:id', function(req, res, next) {
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query={_id: ObjectID.createFromHexString(req.params.id)};
    dbo.collection(collectionName).find(query).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log('get object:'+result);
        db.close();
      });
  }); 
});
// Update
router.put('/sudoku/:id', function(req, res, next) {
  // json is req.body
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query={_id: ObjectID.createFromHexString(req.params.id)};
    var data=req.body;
    if (data._id) {
      delete data._id;
    }
    dbo.collection(collectionName).updateOne(query,{ $set: req.body }, function(err, dbres) {
      if (err) throw err;
      res.send(query);
      console.log("object updated, id:"+query._id);
      db.close();
    });
  }); 
});
// Delete
router.delete('/sudoku/:id', function(req, res, next) {
  // json is req.body
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query={_id: ObjectID.createFromHexString(req.params.id)};
    dbo.collection(collectionName).deleteOne(query, function(err, dbres) {
      if (err) throw err;
      res.send(query);
      console.log("object deleted, id:"+query._id);
      db.close();
    });
  }); 
});
/* root path shows all we have
router.get('/sudoku', function(req, res, next) {
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query={};
    dbo.collection(collectionName).find(query).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log('all objects:'+result);
        db.close();
      });
  });
});
*/
router.post('/sudoku/find', function(req, res, next) {
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    if (req.body._id) {
      req.body._id=ObjectID.createFromHexString(req.body._id);
    }
    dbo.collection(collectionName).find(req.body).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log('query:'+JSON.stringify(req.body)+',objects found:'+result.length);
        db.close();
      });
  });
});

module.exports = router;
