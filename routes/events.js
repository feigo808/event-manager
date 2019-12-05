const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/models');
const { DateTime } = require('luxon');
const auth = require('./auth-helper');

//#region --- Get event data by date ---
// Get: From Home Page with the Date
router.get('/', auth, async function (req, res, next) {
    try {
        let where = {};

        // Get the date
        const date = DateTime.fromISO(req.query['d']);
        // If it's the GET method by date
        if (date.isValid) {
            const nextDay = date.plus({ days: 1 });

            const times = [];
            // Time label is every 30 mins, from 8am to 23pm
            for (let i = 8; i < 23; i++) {
                // 整点
                const clock = {
                    // only for display on the header
                    label: '' + i,
                    // Event selectable time, for the pulldown display
                    startTime: date.plus({ hours: i }).toFormat('HH:mm'),           // 08:00
                    endTime: date.plus({ hours: i, minutes: 30 }).toFormat('HH:mm'),    // 08:30
                    // Available time or not
                    available: false,
                    // Related eventId
                    eventId: 0,
                };
                times.push(clock);

                // 半点
                const half = {
                    label: '',
                    startTime: date.plus({ hours: i, minutes: 30 }).toFormat('HH:mm'),  // 08:30
                    endTime: date.plus({ hours: i + 1 }).toFormat('HH:mm'), // 09:00
                    available: false,
                    eventId: 0,
                };
                times.push(half);
            };

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

                // Update info for every event
                times.filter(
                    t => t.startTime >= timeFrom && t.endTime <= timeTo
                ).forEach(t => {
                    t.available = i.available;
                    t.booked = !i.available;
                    t.eventId = i.id;
                });
            }

            // Only avail select time will be showed in pulldown list
            const timesForSelect = times.filter(t => t.eventId !== 0);
            // Which day has been selected
            const fullDate = date.toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' });
            const hiddenDate = date.toFormat('yyyy-MM-dd');
            res.render('events', {
                fullDate,
                times,
                timesForSelect,
                dayEvents,
                hiddenDate
            });
        }
        // GET method by eventId
        else {
            const id = req.query['id'] | 0;
            if (id) {
                where = { ...where, id };
            }

            const list = await db.Event.findAll({
                where,
                order: [
                    ['available', 'DESC'],
                    ['startTime', 'ASC'],
                ],
            });
            res.json(list);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error ${error.message}`);
        return;
    }
});
//#endregion

//#region  ---POST event data ---
router.post('/:id', auth, async (req, res) => {
    // event detail
    const _event = req.body;
    _event.id = req.params['id'] | 0;

    try {
        // このように書けば、saveDataに全ての項目が含まれてる
        let saveData = db.Event.build({ available: false });
        // If it's update
        if (_event.id) {
            // Find the data first
            saveData = await db.Event.findByPk(_event.id);
            // Not exist
            if (!saveData) {
                res.status(404).json({ result: 'error', message: 'Not found' });
                return;
            }
        }
        // Save all the infos from the Form
        saveData.startTime = _event.startTime;
        saveData.endTime = _event.endTime;
        saveData.activity = _event.activity;
        saveData.location = _event.location;
        saveData.note = _event.note;

        // id のみ取得
        const { id } = await saveData.save();
        const rtnEvent = await db.Event.findByPk(id);
        res.json(rtnEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: 'error', message: error.message });
        return;
    }
});
//#endregion

//#region 
router.delete('/:id', auth, async (req, res) => {
    const id = req.params['id'] | 0;
    const existing = await db.Event.findByPk(id);
    if (!existing) {
        res.status(404).json({ result: 'error', message: 'Not found' });
        return;
    }

    try {
        // Destory means delete
        existing.destroy();
        res.json({ result: 'ok' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: 'error', message: error.message });
        return;
    }
});
//#endregion

module.exports = router;
