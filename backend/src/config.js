require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'secret_dev_replace_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'mercylab',
    username: process.env.DB_USER || 'mercylab',
    password: process.env.DB_PASS || 'mercylabpass',
    dialect: 'postgres'
  }
};
