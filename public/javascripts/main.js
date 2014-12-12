sigma.renderers.def = sigma.renderers.canvas;

var s = new sigma({
	type: 'canvas',
	container: 'container',
});
s.settings({
    defaultNodeColor: "#7e7e7e",
    defaultNodeHoverColor: "#41A317",
    nodeHoverColor: "default",
    labelColor: "node",
    defaultLabelHoverColor: "#41A317",
    labelHoverColor: "default",
    labelHoverShadow: "default",
    labelHoverShadowColor: "#41A317",
    hoverFontStyle: "bold",

    defaultEdgeColor: "#d3d3d3",
    edgeColor: "default",
    enableEdgeHovering: true,
    defaultEdgeHoverColor: '#52D017',
    edgeHoverColor: 'default',
    edgeHoverSizeRatio: 2,
    edgeHoverExtremities: true,

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

var menuItems = {
	newNode: "Create New Node",
	edit: "Edit",
	del: "Delete",
	hide: "Hide",
	reverse: "Reverse"
};

$(".hiddable").hide();
$(".menu").menu();
var hiddable_shown = false;
s.bind('clickStage doubleClickStage clickNode doubleClickNode'
	+ ' clickEdge doubleClickEdge', function(e){
	if(hiddable_shown){
		$(".hiddable").hide();
		hiddable_shown = false;
		return;
	}
	if(e.type == 'clickStage'){
		//
	} else if (e.type == 'doubleClickStage'){
		doubleClickStage(e);
	} else if (e.type == 'clickNode'){
		console.log(e.data.node);
	} else if (e.type == 'doubleClickNode'){
		doubleClickNode(e);
	} else if (e.type == 'clickEdge'){
		console.log(e.data.edge);
	} else if (e.type == 'doubleClickEdge'){
		//
	}
});

s.bind('rightClickStage rightClickNode rightClickEdge', function(e){
	hiddable_shown = !hiddable_shown;
	if(!hiddable_shown){
		$(".hiddable").hide();
		return;
	}
	var clickPosition = {
		top: e.data.captor.clientY + 2,
		left: e.data.captor.clientX + 1
	};
	if(e.type == 'rightClickStage'){
		$("#stage-menu").menu({
			select: function(evt, ui){
				hiddable_shown = false;
				if(ui.item.text() == menuItems.newNode){
					console.log("Create New Node.");
					$("#new-node").css(clickPosition)
						.keypress(function(evt_key){
							if(evt_key.which == 13){
								var title = $("#new-node input:first").val();
								if(title == null || title.length < 1) return;
								addNode(e, title);
								$(this).hide();
								hiddable_shown = false;
							}
						})
						.show();
					$("#new-node input:last").click(function(){
						var title = $("#new-node input:first").val();
						if(title == null || title.length < 1) return;
						addNode(e, title);
						$("#new-node").hide();
						hiddable_shown = false;
					});
					hiddable_shown = true;
				}
				$(this).hide();
			}
		}).css(clickPosition).show();
	} else if(e.type == 'rightClickNode') {
		$("#node-menu").menu({
			select: function(evt, ui){
				if(ui.item.text() == menuItems.edit){
					console.log("Edit Node: " + e.data.node.id);
				} else if(ui.item.text() == menuItems.del){
					console.log("Delete Node: " + e.data.node.id);
				} else if(ui.item.text() == menuItems.hide){
					console.log("Hide Node: " + e.data.node.id);
				}
				$(this).hide();
				hiddable_shown = false;
			}
		}).css(clickPosition).show();
	} else if(e.type == 'rightClickEdge') {
		$("#edge-menu").menu({
			select: function(evt, ui){
				if(ui.item.text() == menuItems.edit){
					console.log("Edit Edge: " + e.data.edge.id);
				} else if(ui.item.text() == menuItems.del){
					console.log("Delete Edge: " + e.data.edge.id);
				} else if(ui.item.text() == menuItems.hide){
					console.log("Hide Edge: " + e.data.edge.id);
				} else if(ui.item.text() == menuItems.reverse){
					console.log("Reverse Edge: " + e.data.edge.id);
				}
				$(this).hide();
				hiddable_shown = false;
			}
		}).css(clickPosition).show();
	}
});

function addNode(e, title){
	if(title==null || title.length == 0) return;
	var p = s.camera.cameraPosition(e.data.captor.x, e.data.captor.y),
		nid = s.graph.nodes().length,
		node = {
			id: "n" + nid,
			label: title,
			size: s.settings('maxNodeSize'),
			x: p.x,
			y: p.y
		};
	s.graph.addNode(node);
	s.refresh();
}

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
		source.color = s.settings('defaultNodeHoverColor');
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

$("body").bind('contextmenu', function(e){
    return false;
}); 

$("#control-panel").mouseover(function(){
	$(this).removeClass("unselectable");
}).mouseout(function(){
	$(this).addClass("unselectable");
}).draggable({
	containment: "window"
});

$("#auto-rescale-checkbox").change(function(){
	s.settings({autoRescale: $(this).is(':checked')});
	if($(this).is(':checked')){
		s.camera.goTo({
			x: 0,
			y: 0,
			angle: 0,
			ratio: 1
		});
	}
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