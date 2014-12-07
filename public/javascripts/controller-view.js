onload = function(){
	initJqueryUI();
	initSigma();
}

function initJqueryUI(){
	//
}

function initSigma(){
	var sigmaController = new SigmaController();
	sigmaController.addRenderer("canvas", "container");
	var dom = document.querySelector("#container canvas:last-child");
	sigmaController.enableDragNodes();
	sigmaController.setSettings({
		autoRescale: false,
	    doubleClickEnabled: false,
		minArrowSize: 5,
	    defaultNodeColor: "#7e7e7e",
	    defaultEdgeColor: "#d3d3d3",
	    edgeColor: "default",
		edgeHoverSizeRatio: 5,
		edgeHoverColor: 'default',
		defaultEdgeHoverColor: '#000',
	    enableEdgeHovering: true,
	    edgeHoverExtremities: true
	});

	// dom.addEventListener('click', function(e) {
	// 	sigmaController.addNode({
	// 		label: 'Node-' + Math.floor(Math.random()*10000),
	// 		x: sigma.utils.getX(e) - dom.offsetWidth / 2,
	// 		y: sigma.utils.getY(e) - dom.offsetHeight /2
	// 	});
	// }, false);

	sigmaController.doubleClickStage(function(e){
		sigmaController.addNode({
			label: 'Node-' + Math.floor(Math.random()*10000),
			x: e.data.captor.x,
			y: e.data.captor.y
		});
	});

	var source = null;
	sigmaController.doubleClickNode(function(e){
		if(!source) {
			source = e.data.node;
			// source.color = '#00ff00';
		}
		else {
			sigmaController.addEdge({
				source: source.id,
				target: e.data.node.id
			});
			// source.color = sigmaController.setSettings.defaultNodeColor;
			source = null;
		}
	});
}