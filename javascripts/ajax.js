function newNodeRequest (node, callback, handleError) {
	$.ajax({
		type: 'POST',
		data: JSON.stringify(node),
		url: '../ajax/node.php',
		contentType: 'application/json',
		success: callback,
		error: handleError
	});
}

function newEdgeRequest (edge, callback, handleError) {
	$.ajax({
		type: 'POST',
		data: JSON.stringify(edge),
		url: '../ajax/edge.php',
		contentType: 'application/json',
		success: callback,
		error: handleError
	});
}

function deleteNodeRequest (nid, callback, handleError) {
	$.ajax({
		type: 'DELETE',
		url: '../ajax/node.php',
        data: JSON.stringify({id: nid}),
		contentType: 'application/json',
		success: callback,
		error: handleError
	});
}

function deleteEdgeRequest (eid, callback, handleError) {
	$.ajax({
		type: 'DELETE',
		url: '../ajax/edge.php',
        data: JSON.stringify({id: eid}),
		contentType: 'application/json',
		success: callback,
		error: handleError
	});
}

function deleteAllEdgesRequest(nid, callback, handleError){
	$.ajax({
		type: 'DELETE',
		url: '../ajax/edge.php?nid=' + nid,
		success: callback,
		error: handleError
	});
}

function getNetwork(callback, handleError){
	$.ajax({
		type: 'GET',
		url: '../ajax/graph.php',
		success: callback,
		error: handleError
	});
}