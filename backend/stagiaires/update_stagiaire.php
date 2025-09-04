<?php
include '../db.php';

$id = $_POST['id'];
$nom = $_POST['nom'];
$prenom = $_POST['prenom'];
$email = $_POST['email'];
$telephone = $_POST['telephone'];
$departement = $_POST['departement'];
$date_debut = $_POST['date_debut'];
$date_fin = $_POST['date_fin'];

$sql = "UPDATE stagiaires SET nom=?, prenom=?, email=?, telephone=?, departement=?, date_debut=?, date_fin=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssi", $nom, $prenom, $email, $telephone, $departement, $date_debut, $date_fin, $id);
$stmt->execute();

echo "updated";
?>