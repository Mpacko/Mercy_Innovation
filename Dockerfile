# Utilise l’image officielle de PHP avec Apache
FROM php:8.1-apache

# Copie tous les fichiers du projet dans le dossier Apache
COPY . /var/www/html/

# Donne les bons droits d'accès
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html
