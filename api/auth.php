<?php
session_start();
$_POST = json_decode(file_get_contents('php://input'),  true);

if (isset($_POST) && !empty($_POST)) {
  $username = $_POST['username'];
  $password = $_POST['password'];

  if ($username == 'admin' && $password == 'admin') {
    $_SESSION['user'] = 'admin';
    ?>
    {
    "success": "true",
    "secret": "Secret only known by admin"
    }
    <?php
  } else {
    ?>
    {
    "success": "false",
    "message": "Invalid credentials"
    }
    <?php
  }
} else {
  ?>
  {
  "success": "false",
  "message": "only POST access accepted"
  }
<?php
}
?>
