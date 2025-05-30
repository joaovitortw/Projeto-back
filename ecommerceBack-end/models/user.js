module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    login: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    senha: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'uni_login',
    timestamps: false
  });

  return User;
};
