var express = require('express');
var router = express.Router();

/* GET nodes listing. */
router.get('/', function(req, res) {
    var db = req.db;
    db.collection('nodes').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to newnode.
 */
router.post('/newnode', function(req, res) {
    var db = req.db;
    db.collection('nodes').insert(req.body, function(err, result) {
        res.send((err === null) ? { msg: '200OK' } : { msg: err });
    });
});

/*
 * DELETE node with :id.
 */
router.delete('/delnode/:id', function(req, res) {
    var db = req.db;
    var nodeToDel = req.params.id;
    db.collection('nodes').remove({id: nodeToDel}, function(err, result) {
        res.send((err === null) ? { msg: '200OK' } : { msg: err });
    });
});

module.exports = router;