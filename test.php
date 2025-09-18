<?php
// test.php : tests unitaires simples pour gestion de stagiaires

// ----- Données simulées -----
$stagiaires = [];

// ----- Fonctions à tester -----
function creerStagiaire($nom, $email) {
    if (empty($nom) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return null;
    }
    return ['nom' => $nom, 'email' => $email];
}

function ajouterStagiaire(&$liste, $stagiaire) {
    if ($stagiaire) {
        $liste[] = $stagiaire;
        return true;
    }
    return false;
}

function supprimerStagiaire(&$liste, $email) {
    foreach ($liste as $index => $stagiaire) {
        if ($stagiaire['email'] === $email) {
            unset($liste[$index]);
            $liste = array_values($liste); // réindexer
            return true;
        }
    }
    return false;
}

// ----- Tests -----
$tests = [];

// Test création stagiaire valide
$stagiaire1 = creerStagiaire('Alice', 'alice@example.com');
$tests['Création stagiaire valide'] = $stagiaire1 !== null;

// Test création stagiaire avec email invalide
$stagiaire2 = creerStagiaire('Bob', 'bob[at]example.com');
$tests['Création stagiaire email invalide'] = $stagiaire2 === null;

// Test ajout stagiaire à la liste
$tests['Ajout stagiaire'] = ajouterStagiaire($stagiaires, $stagiaire1) === true;

// Test nombre de stagiaires après ajout
$tests['Nombre de stagiaires après ajout'] = count($stagiaires) === 1;

// Test suppression stagiaire
$tests['Suppression stagiaire'] = supprimerStagiaire($stagiaires, 'alice@example.com') === true;

// Test liste vide après suppression
$tests['Liste vide après suppression'] = count($stagiaires) === 0;

// ----- Affichage des résultats -----
$success = true;
foreach ($tests as $name => $result) {
    if ($result) {
        echo "✅ Test réussi : $name\n";
    } else {
        echo "❌ Test échoué : $name\n";
        $success = false;
    }
}

exit($success ? 0 : 1); // 0 = succès pour Jenkins