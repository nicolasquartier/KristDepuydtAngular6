<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$_POST = json_decode(file_get_contents('php://input'),  true);

if (isset($_POST) && !empty($_POST)) {
  $id = $_POST['id'];

  $conn = new mysqli("localhost","root","","nicolgy207_kristdepuydt");

  $str = "DELETE FROM exposities where id = '" . $id . "'";
  $result = $conn->query($str);

  if ($result === TRUE) {
    echo('Expositie deleted');
  } else {
    echo('Error: ' . $result . '<br>' . $conn->error);
  }

  $conn->close();
}
?>
