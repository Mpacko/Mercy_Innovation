# MercyLab Interns App

Application PHP simple pour gérer les stagiaires (prototype).
- Pas de base de données : les données sont stockées en session PHP.
- Mot de passe admin pré-défini dans `index.php` : changez `$ADMIN_PASSWORD`.

## Utilisation

1. Placer le dossier `MercyLab_interns_app` dans la racine d'un serveur PHP (ex. XAMPP/WAMP/LAMP) ou exécuter le serveur intégré :
```
php -S localhost:8000
```
2. Ouvrir `http://localhost:8000` (ou l'URL appropriée).

## Fichiers
- `index.php` : fichier principal contenant la page d'accueil, connexion et dashboard.
- `README.md` : ce fichier.

## Personnalisation rapide
- Modifier le mot de passe : éditez la variable `$ADMIN_PASSWORD` en haut de `index.php`.
- Persistance : pour persister les stagiaires au-delà des sessions, vous pouvez soit écrire dans un fichier JSON, soit connecter une base de données. Je peux t'aider à faire ça.
