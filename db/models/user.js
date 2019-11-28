'use strict';

// for hashing password 
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: 'UserName must be between 2 and 30 characters in length.'
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: { msg: 'Email address must be valid' },
        len: {
          args: [6, 128],
          msg: "Email address must be between 6 and 128 characters in length."
        },
      },
      unique: {
        args: true,
        msg: 'Email address already in use!'
      },
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [6, 20],
          msg: "Password must be between 6 and 20 characters in length."
        },
        // Change to Hash 
        set(value) {
          this.setDataValue('password', User.hashPwd(value));
        },
      },
    },
  }, {
    freewTableName: true,
    tableName: 'users',
    timestamps: false,
  });
  User.associate = function (models) {
    // associations can be defined here
  };

  // Hash Method
  User.hashPwd = function (value) {
    const shasum = crypto.createHash('sha1');
    shasum.update(value);
    return shasum.digest('hex');
  };

  return User;
};