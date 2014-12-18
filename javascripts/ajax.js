var apiKey = "tMOOR41-N4fzAIZ76Il5Uv4nlj60bPrF",
	db = "mindnetwork-google",
	url = "https://api.mongolab.com/api/1/databases/"
		+ db + "/collections";

function newNodeRequest (node, callback) {
	$.ajax({
		type: 'POST',
		data: JSON.stringify(node),
		url: url + '/nodes?apiKey=' + apiKey,
		contentType: 'application/json',
		success: callback
	});
}

function newEdgeRequest (edge, callback) {
	$.ajax({
		type: 'POST',
		data: JSON.stringify(edge),
		url: url + '/edges?apiKey=' + apiKey,
		contentType: 'application/json',
		success: callback
	});
}

function deleteNodeRequest (nid, callback) {
	$.ajax({
		type: 'DELETE',
		url: url + '/nodes/' + nid + "?apiKey="+apiKey,
		success: callback
	});
}

function deleteEdgeRequest (eid, callback) {
	$.ajax({
		type: 'DELETE',
		url: '/edges/deledge/' + eid,
		success: callback
	});
}

function deleteAllEdgesRequest(nid, callback){
	$.ajax({
		type: 'DELETE',
		url: '/edges/deledges/' + nid,
		success: callback
	});
}

function getNodes(callback){
	$.getJSON(url + '/nodes?apiKey=' + apiKey,
		function(data){ callback(data); });
}

function getEdges(callback){
	$.getJSON(url + '/edges?apiKey=' + apiKey,
		function(data){ callback(data); });
}