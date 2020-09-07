require('newrelic');
// Dependency
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const path = require('path');
const expressStaticGzip = require("express-static-gzip");
const db = require('../database/index.js');

const app = express();
const PORT = 3005;
const publicPath = path.join(__dirname, '/../public');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/rooms/:room_id', expressStaticGzip(publicPath, {
  enableBrotli: true,
  orderPreference: ['br']
}));

const propertiesModels = require('./routes/properties.js');
//create a route for properties
app.use('/properties', propertiesModels);

//create a route for reservation
const reservationModels = require('./routes/reservations.js');
//create a route for properties
app.use('/reservations', reservationModels);


app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}/rooms/3/`);
});
