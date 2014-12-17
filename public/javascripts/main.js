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

sigma.plugins.dragNodes(s, s.renderers[0]);

var menuItems = {
		newNode: "Create New Node",
		edit: "Edit",
		del: "Delete",
		hide: "Hide",
		reverse: "Reverse",
		removeAllEdges: "Remove All Edges"
	},
	hiddable_shown = false,
	nodeClicked = false,
	stageMenu = { width: $("#stage-menu").width(),
		height: $("#stage-menu").height()}
	nodeMenu = {width: $("#node-menu").width(),
		height: $("#node-menu").height()},
	edgeMenu = {width: $("#edge-menu").width(),
		height: $("#edge-menu").height()},
	nameValue = {width: $("#name-value").width(),
		height: $("#name-value").height()},
	newNodeElement = {width: $("#new-node").width(),
		height: $("#new-node").height()};

$("body").bind('contextmenu', function(e){
    return false;
}); 

$(".menu").menu().hide();
$("#new-node").hide();
$("input[type='text']").on("click", function () {
   $(this).select();
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
		s.camera.goTo({x: 0, y: 0, angle: 0, ratio: 1});
	} else {
		if($("#layout-checkbox").is(":checked")){
			$("#layout-checkbox").trigger("click");
		}
	}
	s.refresh();
});

$("#layout-checkbox").change(function(){
	if($(this).is(':checked')){
		if(!$("#auto-rescale-checkbox").is(":checked")){
			s.settings({autoRescale: true});
			$("#auto-rescale-checkbox").prop('checked', true);
		}
		s.camera.goTo({x: 0, y: 0, angle: 0, ratio: 1});
		s.refresh();
		s.startForceAtlas2();
	} else {
		if($("#auto-rescale-checkbox").is(":checked")){
			$("#auto-rescale-checkbox").prop('checked', false);
			s.settings({autoRescale: false});
		}
		s.killForceAtlas2();
		reMapGraphToRender();
		s.refresh();
	}
});

s.bind('clickStage doubleClickStage clickNode doubleClickNode'
	+ ' clickEdge doubleClickEdge', function(e){
	if(hiddable_shown){
		$(".menu").hide();
		$("#node-info").hide();
		$("#new-node").hide().unbind()
			.removeClass().children().last().unbind();
		$("#name-value").hide().unbind()
			.removeClass().children().last().unbind();
		hiddable_shown = false;
		return;
	}
	if(e.type == 'clickStage'){
		//
	} else if (e.type == 'doubleClickStage'){
		//
	} else if (e.type == 'clickNode'){
		console.log(e);
		if(e.data.captor.ctrlKey) doSelectNode(e);
		else showNodeInfo(e);
	} else if (e.type == 'doubleClickNode'){
		//
	} else if (e.type == 'clickEdge'){
		console.log(e.data.edge);
	} else if (e.type == 'doubleClickEdge'){
		//
	}
});

s.bind('rightClickStage rightClickNode rightClickEdge', function(e){
	hiddable_shown = !hiddable_shown;
	if(!hiddable_shown){
		$(".menu").hide();
		$("#node-info").hide();
		$("#new-node").hide().unbind()
			.removeClass().children().last().unbind();
		$("#name-value").hide().unbind()
			.removeClass().children().last().unbind();
		return;
	}
	var pos = adjustPosition(e, stageMenu);
	console.log(pos.cls);
	if(e.type == 'rightClickStage'){
		if($("#layout-checkbox").is(":checked"))
			$("#layout-checkbox").trigger('click');
		if(s.settings('autoRescale'))
			$("#auto-rescale-checkbox").trigger('click');
		$("#stage-menu").menu({
			select: function(evt, ui){
				hiddable_shown = false;
				if(ui.item.text() == menuItems.newNode){
					doSelectCreateNewNode(e);
				}
				$(this).hide();
			}
		}).addClass(pos.cls).css(pos.css).show();
	} else if(e.type == 'rightClickNode') {
		$("#node-menu").menu({
			select: function(evt, ui){
				var p = adjustPosition(e, nameValue, 10),
					nid = e.data.node.id;
				hiddable_shown = false;
				if(ui.item.text() == menuItems.edit){
					console.log("Edit Node: " + nid);
					$("#name-value").removeClass().addClass(p.cls).css(p.css).show();
					hiddable_shown = true;
				} else if(ui.item.text() == menuItems.del){
					console.log("Delete Node: " + nid);
					removeNode(nid);
				} else if(ui.item.text() == menuItems.hide){
					console.log("Hide Node: " + nid);
					e.data.node.hidden = true;
					s.refresh();
				} else if(ui.item.text() == menuItems.removeAllEdges){
					console.log("Remove All Edges of Node: " + nid);
					removeAllEdges(nid);
				}
				$(this).hide();
			}
		}).addClass(pos.cls).css(pos.css).show();
	} else if(e.type == 'rightClickEdge') {
		$("#edge-menu").menu({
			select: function(evt, ui){
				var eid = e.data.edge.id;
				if(ui.item.text() == menuItems.edit){
					console.log("Edit Edge: " + eid);
				} else if(ui.item.text() == menuItems.del){
					console.log("Delete Edge: " + eid);
					removeEdge(eid);
				} else if(ui.item.text() == menuItems.hide){
					console.log("Hide Edge: " + eid);
					e.data.edge.hidden = true;
					s.refresh();
				} else if(ui.item.text() == menuItems.reverse){
					console.log("Reverse Edge: " + eid);
				}
				$(this).hide();
				hiddable_shown = false;
			}
		}).addClass(pos.cls).css(pos.css).show();
	}
});

var nodeInfo = {width: $("#node-info").width(),
				height: $("#node-info").height()},
	tabs = $(".tabs > li");
tabs.on("click", function(){
	tabs.removeClass("active");
	$(this).addClass("active");
	$(".detail").html("<span>"+$(this).text()+"</span>");
});
function showNodeInfo(e){
	var node = e.data.node,
		pos = adjustPosition(e, nodeInfo, 10);
	$("#node-info").removeClass().addClass(pos.cls).css(pos.css).show();
	hiddable_shown = true;
}

function removeNode(nid){
	deleteNodeRequest(nid, function(res){
		if(res.msg=='200OK'){
			s.graph.dropNode(nid);
			s.refresh();
		} else { alert(res.msg); }
	});
	deleteAllEdgesRequest(nid, function(res){
		if(res.msg != "200OK") { alert(res.msg); }
	});
}

function removeEdge(eid){
	deleteEdgeRequest(eid, function(res){
		if(res.msg=='200OK'){
			e.data.edge.hidden = true;
			s.graph.dropEdge(eid);
			s.refresh();
		} else { alert(res.msg);}
	});
}

function removeAllEdges(nid){
	deleteAllEdgesRequest(nid, function(res){
		if(res.msg == "200OK"){
			s.graph.edges().forEach(function(e){
				if(e.source == nid || e.target == nid){
					s.graph.dropEdge(e.id);
				}
			});
			s.refresh();
		}
		else { alert(res.msg); }
	});
}

function doSelectCreateNewNode(e){
	console.log("Create New Node.");
	var pos = adjustPosition(e, newNodeElement, 10);
	$("#new-node").removeClass().addClass(pos.cls).css(pos.css)
		.keypress(function(evt_key){
			if(evt_key.which == 13){
				var title = $("#new-node input:first").val();
				if(title == null || title.length < 1) return;
				addNode(e, title);
				$(this).children().last().unbind();
				$(this).unbind().hide();
				hiddable_shown = false;
			}
		}).show();
	$("#new-node input:last").click(function(){
		var title = $("#new-node input:first").val();
		if(title == null || title.length < 1) return;
		addNode(e, title);
		$(this).unbind();
		$("#new-node").unbind().hide();
		hiddable_shown = false;
	});
	hiddable_shown = true;
}

function addNode(e, title){
	if(title==null || title.length == 0) return;
	var p = s.camera.cameraPosition(e.data.captor.x, e.data.captor.y),
		node = {
			id: title,
			label: title,
			size: s.settings('maxNodeSize'),
			x: p.x,
			y: p.y
		};
	newNodeRequest(node, function(res){
		if(res.msg == '200OK'){
			s.graph.addNode(node);
			s.refresh();
		} else {
			alert(res.msg);
		}
	});
}

var source = null;
function doSelectNode(e){
	var node = e.data.node;
	if(!source)	{
		source = node;
		source.color = s.settings('defaultNodeHoverColor');
	}
	else if(source.id != node.id){
		var edge = {
			id: source.id + "->" + node.id,
			source: source.id,
			target: node.id,
			size: s.settings('maxEdgeSize')
		};
		source.color = s.settings('defaultNodeColor');
		source = null;
		newEdgeRequest(edge, function(res){
			if(res.msg == '200OK'){
				s.graph.addEdge(edge);
				s.refresh();
			} else {
				alert(res.msg);
			}
		});
	} else {
		source.color = s.settings('defaultNodeColor');
		source = null;
	}
	s.refresh();
}

function adjustPosition(e, target, ps){
	var w = target.width,
		h = target.height,
		x = e.data.captor.clientX,
		y = e.data.captor.clientY,
		winW = $(window).width(),
		winH = $(window).height(),
		cls = "";
	if(!ps) ps = 0;
	if(y + h + ps + 1 > winH){
		y = winH - h - 2*ps - 1;
		cls += "down";
	} else {
		y += 1 + ps;
		cls += "up";
	}
	if(x + w + 1 > winW){
		x -= 1 + w - ps;
		if(x + w > winW) x = winW - w - 10;
		cls += "right";
	} else {
		x += 1 - ps;
		cls += "left";
	}
	return { css: {	top: y,	left: x	}, cls: cls };
}

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
		n.size = s.settings('maxNodeSize');
	});
	// s.graph.edges().forEach(function(e){
	// 	e.size /= bounds.weightMax / s.settings('maxEdgeSize');
	// });
	s.refresh();
}

getGraph();
function getGraph(){
	var nodes = null,
		edges = null,
		graph = {nodes: [], edges: []};
	getNodes(function(data){
		graph.nodes = data;
		console.log(data);
		s.graph.clear().read(graph);
		s.refresh();
		if(!$("#layout-checkbox").is(':checked')){
			$("#layout-checkbox").trigger('click');
		}
	});
	getEdges(function(data){
		graph.edges = data;
		console.log(graph);
		s.graph.clear().read(graph);
		s.refresh();
		if(!$("#layout-checkbox").is(':checked')){
			$("#layout-checkbox").trigger('click');
		}
	});
}