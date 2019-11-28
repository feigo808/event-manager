'use strict';

// Used for checking errors
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define(
        'Event',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            startTime: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: true
                },
            },
            endTime: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: true
                },
            },
            available: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            activity: {
                type: DataTypes.STRING(200),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 200],
                        msg: 'The length is too long.'
                    },
                },
            },
            location: {
                type: DataTypes.STRING(1000),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 1000],
                        msg: 'The length is too long.'
                    },
                },
            },
            note: {
                type: DataTypes.STRING(1000),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 1000],
                        msg: 'The length is too long.'
                    },
                },
            },
        },
        {
            freewTableName: true,
            tableName: 'events',
            timestamps: false,
            // Validations for all table columns
            validate: {

            },
        }
    );
    Event.associate = function (models) {
        // associations can be defined here
    };
    return Event;
};