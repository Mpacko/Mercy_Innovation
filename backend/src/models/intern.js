const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Intern = sequelize.define('Intern', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: true },
    start: { type: DataTypes.DATEONLY, allowNull: true },
    end: { type: DataTypes.DATEONLY, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true, defaultValue: 'Active' },
    notes: { type: DataTypes.TEXT, allowNull: true },
    ownerId: { type: DataTypes.UUID, allowNull: true }
  }, {
    tableName: 'interns',
    timestamps: true
  });

  return Intern;
};
