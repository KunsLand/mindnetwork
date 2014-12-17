function newNodeRequest (node, callback) {
	$.ajax({
		type: 'POST',
		data: node,
		url: '/nodes/newnode',
		dataType: 'JSON'
	}).done(function(res){
		callback(res);
	});
}

function newEdgeRequest (edge, callback) {
	$.ajax({
		type: 'POST',
		data: edge,
		url: '/edges/newedge',
		dataType: 'JSON'
	}).done(function(res){
		callback(res);
	});
}

function deleteNodeRequest (nid, callback) {
	$.ajax({
		type: 'DELETE',
		url: '/nodes/delnode/' + nid
	}).done(function(res){
		callback(res);
	});
}

function deleteEdgeRequest (eid, callback) {
	$.ajax({
		type: 'DELETE',
		url: '/edges/deledge/' + eid
	}).done(function(res){
		callback(res);
	});
}

function deleteAllEdgesRequest(nid, callback){
	$.ajax({
		type: 'DELETE',
		url: '/edges/deledges/' + nid
	}).done(function(res){
		callback(res);
	});
}

function getNodes(callback){
	$.getJSON('/nodes', function(data){ callback(data); });
}

function getEdges(callback){
	$.getJSON('/edges', function(data){ callback(data); });
}