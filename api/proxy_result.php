<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$_POST = json_decode(file_get_contents('php://input'), true);
$url = $_POST['url'];
$content = file_get_contents($url);

// This will remove unwanted characters.
// Check http://www.php.net/chr for details
for ($i = 0; $i <= 31; ++$i) {
  $content = str_replace(chr($i), "", $content);
}
$content = str_replace(chr(127), "", $content);

//@TODO: https://stackoverflow.com/questions/17219916/json-decode-returns-json-error-syntax-but-online-formatter-says-the-json-is-ok

echo($content);
