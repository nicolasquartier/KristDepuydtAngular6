<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$_POST = json_decode(file_get_contents('php://input'),  true);

if (isset($_POST) && !empty($_POST)) {
  $id = $_POST['id'];
  $txtUpdatedTitle = $_POST['title'];
  $txtUpdatedLocation = $_POST['location'];

  $conn = new mysqli("localhost","root","","nicolgy207_kristdepuydt");

  $str = "UPDATE exposities SET name = '" . $txtUpdatedTitle . "', description = '" . $txtUpdatedLocation . "' where id = '" . $id . "'";
  $result = $conn->query($str);

  if ($result === TRUE) {
    echo "expositieDetails updated successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $conn->close();
}
?>
