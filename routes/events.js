const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/models');
const { DateTime } = require('luxon');
const auth = require('./auth-helper');

// // Get: From Home Page with the Date(?)
// router.get('/', auth, async function (req, res, next) {
//     try {
//         // Get the data of that day
//         const date = DateTime.fromISO(req.query['d']);
//         if (!date.isValid) {
//             return;
//         }

//         const eventList = await db.Event.findAll({
//             where: {
//                 startTime: { [Op.gte]: date.toJSDate() },
//                 endTime: { [Op.lt]: date.plus({ days: 1 }).toJSDate() },
//             },
//             order: [
//                 ['available', 'DESC'],
//                 ['startTime', 'ASC'],
//             ]
//         });

//         res.json(eventList);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send(`Error ${error.message}`);
//         return;
//     }
// });

// // Pass from the Home Page
// router.get('/:year/:month/:day', auth, async (req, res) => {

// });

// Get: From Home Page with the Date
router.get('/', auth, async function (req, res, next) {
    const date = DateTime.fromISO(req.query['d']);
    if (!date.isValid) {
        return;
    }
    const nextDay = date.plus({ days: 1 });

    const times = [];
    // Time label is every 30 mins, from 8am to 23pm
    for (let i = 8; i < 23; i++) {
        // 整点
        const clock = {
            // Display label
            label: '' + i,
            startTime: date.plus({ hours: i }).toFormat('HH:mm'),
            endTime: date.plus({ hours: i, minutes: 30 }).toFormat('HH:mm'),
            available: false,
            eventId: 0,
        };
        times.push(clock);

        // 半点
        const half = {
            label: '',
            startTime: date.plus({ hours: i, minutes: 30 }).toFormat('HH:mm'),
            endTime: date.plus({ hours: i + 1 }).toFormat('HH:mm'),
            available: false,
            eventId: 0,
        };
        times.push(half);
    };

    try {
        // All events of that day
        var dayEvents = await db.Event.findAll({
            where: {
                startTime: {
                    [Op.gte]: date.toJSDate()
                },
                endTime: {
                    [Op.lt]: nextDay.toJSDate()
                }
            },
            order: [
                ['available', 'DESC'],
            ]
        });

        // Separate every event of that day
        for (const i of dayEvents) {
            // console.log(JSON.stringify(i));
            const timeFrom = DateTime.fromSQL(i.startTime).toFormat('HH:mm');
            const timeTo = DateTime.fromSQL(i.endTime).toFormat('HH:mm');

            // const filteredTimes = times.filter(
            //     t => t.startTime >= timeFrom && t.endTime <= timeTo
            // );
            // for (const t of filteredTimes) {
            //     t.available = i.available;
            //     t.eventId = i.id;
            //     t.booked = !i.available;
            // }

            // Update info for every event
            times.filter(
                t => t.startTime >= timeFrom && t.endTime <= timeTo
            ).forEach(t => {
                t.available = i.available;
                t.booked = !i.available;
                t.eventId = i.id;
                t.from = timeFrom;
                t.to = timeTo;
            });
        }

        // Only avail select time will be showed in pulldown list
        const timesForSelect = times.filter(t => t.eventId !== 0);
        // Which day has been selected
        const fullDate = date.toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' });

        res.render('events', {
            fullDate,
            times,
            timesForSelect,
            dayEvents
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error ${error.message}`);
        return;
    }
});

module.exports = router;
