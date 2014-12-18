var express = require('express');
var router = express.Router();

/* GET nodes listing. */
router.get('/', function(req, res) {
    var query = req.client.query('select * from node');
    query.on('row', function(err, row){
       res.send(JSON.stringify(row)); 
    });
});

/*
 * POST to newnode.
 */
router.post('/newnode', function(req, res) {
    var client = req.client,
        data = req.body;
    client.query(
        "insert into node(id, label, size, x, y) values($1, $2, $3, $4, $5)",
        [data.id, data.label, data.size, data.x, data.y],
        function(err, result) {
        res.send((err === null) ? { msg: '200OK' } : { msg: err });
    });
});

/*
 * DELETE node with :id.
 */
router.delete('/delnode/:id', function(req, res) {
    var client = req.client;
    var nodeToDel = req.params.id;
    client.query("delete from node where id = '" + nodeToDel + "'",
        function(err, result) {
        res.send((err === null) ? { msg: '200OK' } : { msg: err });
    });
});

module.exports = router;