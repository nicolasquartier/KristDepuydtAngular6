<?php

session_start();

$user = $_SESSION['user'];

if($user = 'admin') {
  echo '{
    "success": "true",
    "message": "Secret only known by admin"
    }';
} else {
  echo '{
    "success": "false",
    "message": "Invalid credentials"
    }';
}
?>
