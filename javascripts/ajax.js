var apiKey = "tMOOR41-N4fzAIZ76Il5Uv4nlj60bPrF",
	db = "mindnetwork-google",
	url = "https://api.mongolab.com/api/1/databases/"
		+ db + "/collections";

function newNodeRequest (node, callback, handleError) {
	$.ajax({
		type: 'POST',
		data: JSON.stringify(node),
		url: url + '/nodes?apiKey=' + apiKey,
		contentType: 'application/json',
		success: callback,
		error: handleError
	});
}

function newEdgeRequest (edge, callback, handleError) {
	$.ajax({
		type: 'POST',
		data: JSON.stringify(edge),
		url: url + '/edges?apiKey=' + apiKey,
		contentType: 'application/json',
		success: callback,
		error: handleError
	});
}

function deleteNodeRequest (nid, callback, handleError) {
	$.ajax({
		type: 'PUT',
		url: url + '/nodes?q={ "id" : "' + nid + '"}&apiKey='+apiKey,
		data: JSON.stringify([]),
		contentType: "application/json",
		success: callback,
		error: handleError
	});
}

function deleteEdgeRequest (eid, callback, handleError) {
	$.ajax({
		type: 'PUT',
		url: url + '/edges?q={ "id" : "' + eid + '"}&apiKey=' + apiKey,
		data: JSON.stringify([]),
		contentType: "application/json",
		success: callback,
		error: handleError
	});
}

function deleteAllEdgesRequest(nid, callback, handleError){
	$.ajax({
		type: 'PUT',
		url: url + '/edges?q={$or: [{"source": "'
			+ nid + '"}, {"target": "' + nid + '"}]}&apiKey='+apiKey,
		data: JSON.stringify([]),
		contentType: "application/json",
		success: callback,
		error: handleError
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