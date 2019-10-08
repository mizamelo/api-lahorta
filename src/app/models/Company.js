module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    cnpj: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    token: DataTypes.STRING,
    verified: DataTypes.BOOLEAN
  });

  return Company;
};
