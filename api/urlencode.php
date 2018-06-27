<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$_POST = json_decode(file_get_contents('php://input'), true);

$encodedUrl = urlencode($_POST['url']);
echo('{
  "encodedUrl": "' . $encodedUrl . '"
}');
?>
