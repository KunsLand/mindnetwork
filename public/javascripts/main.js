var s = new sigma({
	type: 'canvas',
	container: 'container',
});
s.settings({
	doubleClickEnabled: false,
	autoRescale: false
});

var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

dragListener.bind('startdrag drag drop dragend', function(e){
	if(e.type == 'startdrag'){
		//
	} else if(e.type == 'drag'){
		//
	} else if(e.type == 'drop'){
		//
	} else if(e.type == 'dragend'){
		//
	}
});

s.bind('clickStage doubleClickStage clickNode doubleClickNode'
	+ ' clickEdge doubleClickEdge', function(e){
	if(e.type == 'clickStage'){
		//
	} else if (e.type == 'doubleClickStage'){
		doubleClickStage(e);
	} else if (e.type == 'clickNode'){
		console.log(e.data.node);
	} else if (e.type == 'doubleClickNode'){
		doubleClickNode(e);
	} else if (e.type == 'clickEdge'){
		//
	} else if (e.type == 'doubleClickEdge'){
		//
	}
});

function doubleClickStage(e){
	var p = s.camera.cameraPosition(e.data.captor.x, e.data.captor.y),
		nid = s.graph.nodes().length,
		node = {
			id: "n" + nid,
			label: "Node-" + nid,
			size: s.settings('maxNodeSize'),
			x: p.x,
			y: p.y
		};
	s.graph.addNode(node);
	s.refresh();
}

var source = null;
function doubleClickNode(e){
	var node = e.data.node;
	if(!source)	{
		source = node;
		source.color = "#006400";
	}
	else if(source.id != node.id){
		var edge = {
			id: "e" + s.graph.edges().length,
			source: source.id,
			target: node.id,
			size: s.settings('maxEdgeSize')
		};
		source.color = s.settings('defaultNodeColor');
		source = null;
		s.graph.addEdge(edge);
	} else {
		source.color = s.settings('defaultNodeColor');
		source = null;
	}
	s.refresh();
}

$("#control-panel").mouseover(function(){
	$(this).removeClass("unselectable");
}).mouseout(function(){
	$(this).addClass("unselectable");
}).draggable({
	containment: "window"
});

$("#auto-rescale-checkbox").change(function(){
	s.settings({autoRescale: $(this).is(':checked')});
	s.refresh();
});

$("#layout-checkbox").change(function(){
	if($(this).is(':checked')){
		$("#auto-rescale-checkbox").prop('checked', true);
		s.camera.goTo({
			x: 0,
			y: 0,
			angle: 0,
			ratio: 1
		});
		s.settings({autoRescale: true});
		s.refresh();
		s.startForceAtlas2();
	} else {
		$("#auto-rescale-checkbox").prop('checked', false);
		s.killForceAtlas2();
		reMapGraphToRender();
		s.settings({autoRescale: false});
		s.refresh();
	}
});

function reMapGraphToRender(){
	if(s.graph.nodes().length < 2) return;
	var r = s.renderers[0],
		maxNodeSize = s.settings('maxNodeSize'),
		renCenterX = r.width / 2,
		renCenterY = r.height / 2,
		bounds = sigma.utils.getBoundaries(s.graph, '', true),
		bWidth = bounds.maxX - bounds.minX,
		bHeight = bounds.maxY - bounds.minY,
		bCenterX = (bounds.maxX + bounds.minX) / 2,
		bCenterY = (bounds.maxY + bounds.minY) / 2,
		scaleRatio = bHeight / (r.height - maxNodeSize * 2)
			 * r.width > bWidth ?
					bHeight / (r.height - maxNodeSize * 2) :
					bWidth / (r.width - maxNodeSize * 2);
	s.graph.nodes().forEach(function(n){
		n.x = (n.x - bCenterX) / scaleRatio;
		n.y = (n.y - bCenterY) / scaleRatio;
		// n.size /= bounds.sizeMax / s.settings('maxNodeSize');
	});
	// s.graph.edges().forEach(function(e){
	// 	e.size /= bounds.weightMax / s.settings('maxEdgeSize');
	// });
	s.refresh();
}