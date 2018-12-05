<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$_POST = json_decode(file_get_contents('php://input'),  true);

if (isset($_POST) && !empty($_POST)) {
  $updatedValue = $_POST['updatedValue'];

  $conn = new mysqli("localhost","root","","nicolgy207_kristdepuydt");

  $result = $conn->query("UPDATE contactdetails SET json = '" . $updatedValue . "'");

  if ($result === TRUE) {
    echo '"contactDetails updated successfully"';
  } else {
    echo '"Error: " . $sql . "<br>" . $conn->error';
  }

  $conn->close();
}
?>
