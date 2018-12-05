<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$_POST = json_decode(file_get_contents('php://input'),  true);

if (isset($_POST) && !empty($_POST)) {
  $year = $_POST['year'];
  $txtNewTitle = $_POST['title'];
  $txtNewLocation = $_POST['location'];

  $conn = new mysqli("localhost","root","","nicolgy207_kristdepuydt");

  $str = "INSERT INTO exposities (year, name, description) VALUES ('" . $year . "', '" . $txtNewTitle . "', '" . $txtNewLocation . "')";
  $result = $conn->query($str);

  if ($result === TRUE) {
    echo('"expositie added successfully"');
  } else {
    echo('"Error: " . $result . "<br>" . $conn->error');
  }
  $conn->close();
}
?>
