<?php

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
    handleGetRequest($_GET);
    break;
    case 'POST':
    handlePostRequest(json_decode(file_get_contents('php://input'), true));
    break;
    case 'PUT':
    break;
    case 'DELETE':
    handleDeleteRequest(json_decode(file_get_contents('php://input'), true));
    break;
    default:
    break;
}


function handleGetRequest($params){
    if(empty($params)){
		$mysql = new SaeMysql();
        $nodes = $mysql->getData( "select * from node" );
        echo json_encode($nodes);
    	$mysql->closeDb();
    } else if(!empty($params['id'])){
		$mysql = new SaeMysql();
        $node = $mysql->getData( "select * from node where id='"
                                . $mysql->escape($params['id']) . "'" );
        echo json_encode($node);
    	$mysql->closeDb();
    }else handleIllegalRequest();
}

function handlePostRequest($params){
    if(!empty($params['id']) && !empty($params['label']) && !empty($params['size'])
       && !empty($params['x']) && !empty($params['y'])){
		$mysql = new SaeMysql();
        $sql = "insert into node(id, label, size, x, y) values ('" 
            . $mysql->escape($params['id']) . "','" . $mysql->escape($params['label'])
            . "'," . intval($params['size']) . ","
            . doubleval($params['x']) . "," . doubleval($params['y']) . ")";
        $mysql->runSql($sql);
        if($mysql->errno() == 0){
            echo json_encode(array('message'=>'Insert Suceed!', 'status'=>'200'));
        } else {
            echo json_encode(array('message'=>$mysql->errmsg(),
                                   'status'=>'500',
                                   'sql'=>$sql,
                                   'postData'=>$params));
        }
    	$mysql->closeDb();
    } else {
        echo json_encode(array(
            'message'=>'A node must have these information: id, label, size, x, y.',
            'status'=>'500'
        ));
    }
}

function handleDeleteRequest($params){
    if(count($params) == 1 && !empty($params['id'])){
		$mysql = new SaeMysql();
        $sql = "delete from edge where source='" . $mysql->escape($params['id'])
            . "' or target='" . $mysql->escape($params['id']) . "'";
        $mysql->runSql($sql);
        if($mysql->errno() == 0){
            $sql = "delete from node where id='" . $mysql->escape($params['id']) . "'";
        	$mysql->runSql($sql);
            if($mysql->errno() == 0)
            	echo json_encode(array('message'=>'Delete Suceed!', 'status'=>'200'));
            else
                echo json_encode(array('message'=> $mysql->errmsg(), 'status'=>'500'));
        } else {
            echo json_encode(array('message'=> $mysql->errmsg(), 'status'=>'500'));
        }
    	$mysql->closeDb();
    } else handleIllegalRequest();
}


function handleIllegalRequest(){
    $message = array(
        "message"=>"Illegal Request",
        "status"=>"404"
    );
    echo json_encode($message);
}

?>