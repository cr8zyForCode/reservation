const express = require('express');
const router = express.Router();
const model = require('../models/properties.js');

router.get('/:id', (req, res) => {
  let queryParams = req.params.id;

  model.getProperty(queryParams, (err, data) => {
    if (err) {
      console.log('could not get data. routes server')
    } else {
      // console.log(data.rows[0])
      res.send(data.rows[0])
    }
  })

});

module.exports = router;