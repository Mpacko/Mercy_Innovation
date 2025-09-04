<?php
include '../db.php';

$id = $_POST['id'];

$sql = "DELETE FROM stagiaires WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

echo "deleted";
?>