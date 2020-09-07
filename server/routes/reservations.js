const express = require('express');
const router = express.Router();
const model = require('../models/reservations.js');
const moment = require('moment');


router.get('/:id', (req, res) => {
  let queryParams = req.params.id;
  // console.log('id')

  model.getReservations(queryParams, (err, data) => {
    if (err) {
      console.log('could not get data. routes server')
    } else {
      // console.log(data, 'inside of reservations')
      res.send(data.rows)
    }
  })
});

router.post('/:id', (req, res) => {
  let check_in = moment(req.body.check_in);
  let check_out = moment(req.body.check_out);

  let dates = [];
  for (let i = check_in; i <= check_out; check_in.add(1, 'days')) {
    dates.push(check_in.format('YYYY-MM-DD'));
  }

  let random = Math.floor(Math.random() * 100000 + 400);
  console.log('reservationid ', random)

  let obj = {
    reservation_id: random,
    property_id: req.params.id,
    total_price: 100,
    total_guests: 6,
    dates: dates,
  }

  // console.log(obj, 'info being sent to db')
  model.createReservations(obj, (err, data) => {
    if (err) {
      res.send('error')
    } else {

      // res.send()
      res.status(200).end()
    }
  })

});


module.exports = router;