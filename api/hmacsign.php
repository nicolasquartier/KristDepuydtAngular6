<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$_POST = json_decode(file_get_contents('php://input'), true);

$result = base64_encode(hash_hmac("sha1",
  $_POST['encodedBasestring'],
  '1ee7d48c0615e6d0&', true));
echo('{
  "result": "' . $result . '"
}');
?>
