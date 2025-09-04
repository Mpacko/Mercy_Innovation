# Utiliser une image PHP avec Apache
FROM php:8.2-apache

# Installer les extensions nécessaires
RUN docker-php-ext-install mysqli

# Copier les fichiers du backend et du frontend
COPY backend/ /var/www/html/backend/
COPY frontend/ /var/www/html/frontend/

# Configurer le DocumentRoot pour pointer vers le frontend
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/frontend|g' /etc/apache2/sites-available/000-default.conf

# Exposer le port 80
EXPOSE 80