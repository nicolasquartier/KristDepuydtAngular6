<?php
require_once("./lib/phpFlickr.php");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$apikey = "78cfdf349b9016acd631feba7e66a701";
$secret = "b3fe6448f1c5f37b";

//$apikey = "6337acd481870286e3d1087590ae665f";
//$secret = "1ee7d48c0615e6d0";

$_POST = json_decode(file_get_contents('php://input'), true);
$token = $_POST['token'];
$item = $_FILES['item'];

//$f = new phpFlickr($apikey, $secret);
//$f->auth("write");

//$f->setToken($token);
//realpath()
//$f->sync_upload("./Smiley.jpg", $title = "the title", $description = "the description", $tags = "tag1,tag2");

echo('{"result": "' . $item  . '"}');
?>
