// All database default setting values
module.exports = {
  development: {
    username: 'feigo808',
    password: 'Aloha808',
    database: 'event-manager-dev',
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    // This part is more for the sequelize
    dialectOptions: {
      useUTC: false, // for reading from database
      dateStrings: true,
      timestamps: false, // no auto mapping createAt and updateAt columns
      typeCast: function (field, next) { // for reading from database
        if (field.type === 'DATETIME') {
          return field.string()
        }
        return next()
      },
    },
    timezone: '-10:00',
  },
  test: {
    username: 'feigo808',
    password: 'Aloha808',
    database: 'event-manager-test',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false,
    // This part is more for the sequelize 
    dialectOptions: {
      useUTC: false, // for reading from database
      dateStrings: true,
      timestamps: false, // no auto mapping createAt and updateAt columns
      typeCast: function (field, next) { // for reading from database
        if (field.type === 'DATETIME') {
          return field.string()
        }
        return next()
      },
    },
    timezone: '-10:00',
  },
  production: {
    username: 'feigo808',
    password: 'Aloha808',
    database: 'event-manager-pro',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false,
    // This part is more for the sequelize 
    dialectOptions: {
      useUTC: false, // for reading from database
      dateStrings: true,
      timestamps: false, // no auto mapping createAt and updateAt columns
      typeCast: function (field, next) { // for reading from database
        if (field.type === 'DATETIME') {
          return field.string()
        }
        return next()
      },
    },
    timezone: '-10:00',
  }
}