module.exports = (sequelize, DataTypes) => {
  const UniLogin = sequelize.define('uni_login', {
    login: {
      type: DataTypes.STRING(200),
      primaryKey: true,
    },
    senha: {
      type: DataTypes.STRING(200),
    },
  }, {
    tableName: 'uni_login',
    timestamps: false,
  });

  return UniLogin;
};
