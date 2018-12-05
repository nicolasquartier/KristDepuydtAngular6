<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$_POST = json_decode(file_get_contents('php://input'),  true);

//$conn = new mysqli("localhost","nicolgy207_nicolgy207","7jaoakxe","nicolgy207_kristdepuydt");
$conn = new mysqli("localhost","root","","nicolgy207_kristdepuydt");
$result = $conn->query("SELECT * FROM exposities");

$outp = "[";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
  if ($outp != "[") {$outp .= ",";}
  $outp .= '{"year":"'  . $rs["year"] . '",';
  $outp .= '"id":"'. $rs["id"]     . '",';
  $outp .= '"name":"'   . $rs["name"]        . '",';
  $outp .= '"description":"'. $rs["description"]     . '",';
  $outp .= '"hasPhotos":"'. $rs["hasPhotos"]     . '",';
  $outp .= '"insdate":"'. $rs["insdate"]     . '"}';
}
$outp .= "]";
$conn->close();

echo($outp);
?>
