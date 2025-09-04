<?php
include '../db.php';

$nom = $_POST['nom'];
$prenom = $_POST['prenom'];
$email = $_POST['email'];
$telephone = $_POST['telephone'];
$departement = $_POST['departement'];
$date_debut = $_POST['date_debut'];
$date_fin = $_POST['date_fin'];

$sql = "INSERT INTO stagiaires (nom, prenom, email, telephone, departement, date_debut, date_fin) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $nom, $prenom, $email, $telephone, $departement, $date_debut, $date_fin);
$stmt->execute();

echo "success";
?>