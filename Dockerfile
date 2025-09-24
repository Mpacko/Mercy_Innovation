# Utilise l'image PHP + Apache officielle
FROM php:8.2-apache

# Mettre à jour et installer des extensions si besoin (ex: pour JSON, mbstring - déjà inclus dans base PHP)
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     libzip-dev unzip git \
  && docker-php-ext-install pdo pdo_mysql zip \
  && rm -rf /var/lib/apt/lists/*

# Active mod_rewrite (utile si besoin futur)
RUN a2enmod rewrite

# Crée un dossier pour stocker les sessions PHP (persistant via volume dans docker-compose)
RUN mkdir -p /var/www/sessions \
 && chown -R www-data:www-data /var/www/sessions \
 && chmod 770 /var/www/sessions

# Copie tout le code de l'application dans le répertoire webroot
# Lorsque tu builds avec le contexte correct, ton dossier local sera copié
COPY . /var/www/html

# Assure les permissions pour Apache
RUN chown -R www-data:www-data /var/www/html \
 && chmod -R 755 /var/www/html

# Expose le port HTTP
EXPOSE 80

# Commande par défaut d'Apache
CMD ["apache2-foreground"]
