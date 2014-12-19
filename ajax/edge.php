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
        $edges = $mysql->getData( "select * from edge" );
        echo json_encode($edges);
    	$mysql->closeDb();
    } else if(!empty($params['id'])){
		$mysql = new SaeMysql();
        $edge = $mysql->getData( "select * from edge where id='"
                                . $mysql->escape($params['id']) . "'" );
        echo json_encode($edge);
    	$mysql->closeDb();
    }else handleIllegalRequest();
}

function handlePostRequest($params){
    if(!empty($params['id']) && !empty($params['source']) && !empty($params['target'])
       && !empty($params['size'])){
		$mysql = new SaeMysql();
        $sql = "insert into edge(id, source, target, size) values ('"
            . $mysql->escape($params['id']) . "','"
            . $mysql->escape($params['source']) . "','"
            . $mysql->escape($params['target']) . "',"
            . intval($params['size'])
            . ")";
        $mysql->runSql($sql);
        if($mysql->errno() == 0){
            echo json_encode(array('message'=>'Insert Suceed!', 'status'=>'200'));
        } else {
            echo json_encode(array('message'=>$mysql->errmsg(), 'status'=>'500'));
        }
    	$mysql->closeDb();
    } else {
        echo json_encode(array(
            'message'=>'An edge must have these information: id, source, target and size.',
            'status'=>'500'
        ));
    }
}

function handleDeleteRequest($params){
    if(count($params) == 1 && (!empty($params['id']) || !empty($params['nid']))){
		$mysql = new SaeMysql();
        $sql = "";
        if(!empty($params['id']))
        	$sql = "delete from edge where id='" . $mysql->escape($params['id']) . "'";
        else
            $sql = "delete from edge where source='" .$mysql->escape($params['id'])
            . "' or target='" . $mysql->escape($params['id']) ."'";
        $mysql->runSql($sql);
        if($mysql->errno() == 0){
            echo json_encode(array('message'=>'Delete Suceed!', 'status'=>'200'));
        } else {
            echo json_encode(array('message'=>$mysql->errmsg(), 'status'=>'500'));
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