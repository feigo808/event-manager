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
                autoIncrement: true,
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
                startTimeAndEndTime() {
                    if (this.startTime >= this.endTime) {
                        throw new Error('Start time must be earlier than End time.');
                    }
                }, overwrappedTime(next) {
                    (async event => {
                        const { id, startTime, endTime, available } = event;
                        const overwrapped = await Event.findAll({
                            where: {
                                // Replace 'lt' to 'lte' and 'gt' to 'gte' if you need to disallow adjacent events.
                                startTime: { [Op.lt]: endTime },
                                endTime: { [Op.gt]: startTime },
                                available: { [Op.eq]: available },
                                id: { [Op.ne]: id },
                            },
                        });

                        if (overwrapped.length > 0) {
                            next('Overwrapped events already exist.');
                            return;
                        }
                        next();
                    })(this);
                },
                availableBlock(next) {
                    if (this.available == true) {
                        next();
                        return;
                    }

                    (async event => {
                        const { id, startTime, endTime, available } = event;
                        const availableBlock = await Event.findAll({
                            where: {
                                startTime: { [Op.lte]: startTime },
                                endTime: { [Op.gte]: endTime },
                                available: { [Op.eq]: true },
                                id: { [Op.ne]: id },
                            },
                        });

                        if (availableBlock.length === 0) {
                            next('Specified time range is not available.');
                            return;
                        }
                        next();
                    })(this);
                },
            },
        }
    );
    Event.associate = function (models) {
        // associations can be defined here
    };
    return Event;
};
