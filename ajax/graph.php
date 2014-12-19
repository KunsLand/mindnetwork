<?php

$method = $_SERVER['REQUEST_METHOD'];

if($method != 'GET') handleIllegalRequest();
else handleGetRequest($_GET);

function handleGetRequest($params){
	$mysql = new SaeMysql();
    if(empty($params)){
        $node = $mysql->getData( "select * from node" );
        $edge = $mysql->getData( "select * from edge" );
        $graph = array("nodes"=>$node, "edges"=>$edge);
        echo json_encode($graph);
    } else handleIllegalRequest();
    $mysql->closeDb();
}

function handleIllegalRequest(){
    $message = array(
        "message"=>"Illegal Request",
        "status"=>"404"
    );
    echo json_encode($message);
}

?>