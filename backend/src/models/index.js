const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: config.db.dialect,
  logging: false
});

const User = require('./user')(sequelize);
const Intern = require('./intern')(sequelize);

User.hasMany(Intern, { foreignKey: 'ownerId', as: 'interns' });
Intern.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

module.exports = { sequelize, User, Intern };
