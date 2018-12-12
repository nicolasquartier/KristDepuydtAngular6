<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$_POST = json_decode(file_get_contents('php://input'), true);
$tokenSecret = isset($_POST['secret']) ? $_POST['secret'] : '';

$result = hash_hmac("sha1",
  $_POST['encodedRequestTokenUrl'],
  '1ee7d48c0615e6d0&' . $tokenSecret, true);
echo('{
  "result": "' . $result . '"
}');
?>
