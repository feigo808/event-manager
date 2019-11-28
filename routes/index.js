const express = require('express');
const router = express.Router();
const auth = require('./auth-helper');
const db = require('../db/models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* GET home page after auth */
router.get('/', auth, async function (req, res, next) {
  const dayHeaders = [
    { name: 'Sun', weekend: true },
    { name: 'Mon' },
    { name: 'Tue' },
    { name: 'Wed' },
    { name: 'Thu' },
    { name: 'Fri' },
    { name: 'Sat', weekend: true },
  ];

  // Get year and month from path
  let year = req.query['y'] - 0;
  let month = req.query['m'] - 0;

  // If couldn't get year and month from the path, then get current data 
  if (isNaN(year)) year = new Date().getFullYear();
  if (isNaN(month)) month = new Date().getMonth() + 1;

  // Get the first day of that month
  const startDate = new Date(year, month - 1, 1);
  // Then get the first day of the calendar
  startDate.setDate(1 - startDate.getDay());
  const beginDate = startDate;
  // The last day of the calendar 
  const endDate = new Date(beginDate).setDate(beginDate.getDate() + 7 * 5);

  // Get all datas of this month
  const events = await db.Event.findAll({
    where: {
      startTime: { [Op.gte]: beginDate, [Op.lt]: endDate },
    },
    order: ['startTime', 'endTime'],
    // 原始查询
    // 默情况下，Sequlize人为查询结构创建实例，通过这个实例可以进行数据的更新、删除等操作。
    // 有时候我只需要显示数据集，而不需要进行处理，这时可以通过设置raw选项来返回原始数据：
    raw: true,
  });

  // 画面に返す配列内容
  const days = [];
  const d = startDate;

  for (let i = 0; i < 35; i++) {
    // Get the available flag of that day
    // 時間帯内に一件でもあればavailable、だからlengthで判断する
    const available =
      events.filter(
        i =>
          new Date(i.startTime) >= d &&
          new Date(i.endTime) < new Date(new Date(d).setDate(d.getDate() + 1))
      ).length > 0;

    // All needed data for that day 
    const day = {
      date: d.toISOString().split('T')[0],
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      isCurrentMonth: d.getMonth() === month - 1,
      available,
    };

    // Add the data to the array
    days.push(day);
    d.setDate(d.getDate() + 1);
  }

  res.render('index', {
    title: `${month}/${year}`,
    dayHeaders,
    days,
    year,
    month,
    prevYear: month > 1 ? year : year - 1,
    nextYear: month < 12 ? year : year + 1,
    prevMonth: month > 1 ? month - 1 : 12,
    nextMonth: month < 12 ? month + 1 : 1,
  });
});

module.exports = router;
