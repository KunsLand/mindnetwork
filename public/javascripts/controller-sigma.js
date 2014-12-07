
function SigmaController(){
	var s = new sigma();
	var g = new sigma.classes.graph();
	s.graph.read(g);
	var nb = new sigma.plugins.neighborhoods();
	var hidden = false, edgeHidden = false;
	var defaultEdgeType;
	
	var parseFileFinished = function(graph, callback){
		defaultEdgeType = graph.defaultEdgeType;
		g.clear().read(graph);
		nb.read(graph);
		s.graph.clear().read(graph);
		s.refresh();
		callback({
			version: graph.version,
			mode: graph.mode,
			defaultEdgeType: graph.defaultEdgeType,
			nodeNum: graph.nodes.length,
			edgeNum: graph.edges.length,
			meta: graph.meta
		});
	}
	
	this.setSettings = function(settings){
		s.settings(settings);
	}
	
	this.addRenderer = function(type, container){
		s.addRenderer({type: type, container: container});
		s.refresh();
	}
	
	this.loadFromGexf = function(gexf, callback){
		sigma.parsers.gexf(gexf, function(graph){
			parseFileFinished(graph, callback);
		});
	}
	
	this.loadFromJson = function(json, callback){
		sigma.parsers.json(json, function(graph){
			parseFileFinished(graph, callback);
		});
	}
	
	this.enableDragNodes = function(){
		sigma.plugins.dragNodes(s, s.renderers[0]);
	}
	
	this.getDefaultEdgeType = function(){return defaultEdgeType;}
	
	this.resetSigma = function(){
		s.camera.goTo({x:0, y:0, angle: 0, ratio: 1});
		s.graph.clear();
		s.graph.read({nodes: g.nodes(), edges: g.edges()});
		s.refresh();
		hidden = false;
		edgeHidden = true;
	}
	
	this.edgeHided = function(){return edgeHidden;}
	this.labelHided = function(){return hidden;}
	
	this.hideLabels = function(){
		if(hidden) return;
		hidden = true;
		s.graph.nodes().forEach(function(n){n.label = null;});
		s.refresh();
	}
	
	this.showLabels = function(){
		if(!hidden) return;
		hidden = false;
		s.graph.nodes().forEach(function(n){n.label = g.nodes(n.id).label;});
		s.refresh();
	}
	
	this.hideEdges = function(){
		if(edgeHidden) return;
		edgeHidden = true;
		s.graph.edges().forEach(function(e){e.hidden = true;});
		s.refresh();
	}
	
	this.showEdges = function(){
		if(!edgeHidden) return;
		edgeHidden = false;
		s.graph.edges().forEach(function(e){e.hidden = false;});
		s.refresh();
	}
	
	this.setNodeSizeDefault = function(){
		s.graph.nodes().forEach(function(n){n.size = 1;});
		s.refresh();
	}
	this.setNodeSizeDegree = function(type){
		s.graph.nodes().forEach(function(n){
			n.size = Math.sqrt(s.graph.degree(n.id, type));
		});
		s.refresh();
	}
	
	this.setEdgeType = function(type){
		s.graph.edges().forEach(function(e){e.type = type;});
		s.refresh();
	}
	
	this.overNode = function(callback){
		s.bind('overNode', function(e){
			var node = e.data.node;
			e.data.node.label = node.label?node.label:g.nodes(node.id).label;
			e.data.node.outDegree = s.graph.degree(node.id, "out");
			e.data.node.inDegree = s.graph.degree(node.id, "in");
			e.data.node.degree = s.graph.degree(node.id);
			callback(e);
		});
	}
	
	this.outNode = function(callback){
		s.bind('outNode', function(e){callback(e);});
	}
	
	this.overEdge = function(callback){
		s.bind('overEdge', function(e){
			var edge = e.data.edge;
			e.data.edge.sourceLabel = g.nodes(edge.source).label;
			e.data.edge.targetLabel = g.nodes(edge.target).label,
			callback(e);
		});
	}
	
	this.outEdge = function(callback){
		s.bind('outEdge', function(e){callback(e);});
	}

	this.clickStage = function(callback){
		s.bind('clickStage', function(e){callback(e);});
	}

	this.doubleClickStage = function (callback) {
		s.bind('doubleClickStage', function(e){callback(e);});
	}

	this.addNode = function (node) {
		if(!node.id) node.id = s.graph.nodes().length;
		if(!node.size) node.size = sigma.settings.maxNodeSize;
		var p = s.camera.cameraPosition(node.x, node.y);
		node.x = p.x, node.y = p.y;
		g.addNode(node);
		s.graph.addNode(node);
		s.refresh();
	}

	this.doubleClickNode = function(callback){
		s.bind('doubleClickNode', function(e){callback(e);});
	}

	this.addEdge = function(edge){
		if(!edge.id) edge.id = s.graph.edges().length;
		var flag = s.graph.edges().some(function(e){
			if(e.source==edge.source && e.target==edge.target)
				return true;
			else
				return false;
		});
		if(flag) return;
		g.addEdge(edge);
		s.graph.addEdge(edge);
		s.refresh();
		console.log(s.graph.edges().length);
	}
}