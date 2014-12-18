var express = require('express');
var router = express.Router();

/* GET nodes listing. */
router.get('/', function(req, res) {
    var client = req.client;
    client.query('select * from edge', function(err, result){
        var data = JSON.stringify(result.rows);
        console.log(data);
        res.send(data);
    });
});

/*
 * POST to newnode.
 */
router.post('/newedge', function(req, res) {
    var client = req.client,
        data = req.body;
    client.query(
        "insert into edge(id, source, target, size) values($1, $2, $3, $4)",
        [data.id, data.source, data.target, data.size],
        function(err, result){
        res.send(
            (err === null) ? { msg: '200OK' } : { msg: err }
        );
    });
});

router.delete('/deledge/:id', function(req, res) {
    var client = req.client;
    var edgeToDel = req.params.id;
    client.query("delete from edge where id = '" + edgeToDel + "'",
        function(err, result) {
        res.send((err === null) ? { msg: '200OK' } : { msg: err });
    });
});

router.delete('/deledges/:id',function(req, res) {
    var client = req.client;
    var nid = req.params.id;
    client.query("delete from edge where source = '" + nid + "' or " +
        "target = '" + nid + "'",
        function(err, result) {
            res.send((err === null) ?
                { msg: '200OK' } : { msg: err });
    });
});


module.exports = router;