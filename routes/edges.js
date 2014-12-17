var express = require('express');
var router = express.Router();

/* GET nodes listing. */
router.get('/', function(req, res) {
    var db = req.db;
    db.collection('edges').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to newnode.
 */
router.post('/newedge', function(req, res) {
    var db = req.db;
    db.collection('edges').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '200OK' } : { msg: err }
        );
    });
});

router.delete('/deledge/:id', function(req, res) {
    var db = req.db;
    var edgeToDel = req.params.id;
    db.collection('edges').remove({id: edgeToDel}, function(err, result) {
        res.send((err === null) ? { msg: '200OK' } : { msg:'error: ' + err });
    });
});

router.delete('/deledges/:id',function(req, res) {
    var db = req.db;
    var nid = req.params.id;
    db.collection('edges').remove(
        {$or: [{source: nid}, {target: nid}]},
        function(err, result) {
            res.send((err === null) ?
                { msg: '200OK' } : { msg:'error: ' + err });
    });
});


module.exports = router;