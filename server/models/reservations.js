/*
FOR RESERVATION AND RESERVATION INFO
post a reservation
get all reservation dates
update a reservation
delete reservation
 */
//IMPORT CLIENT FROM DB
let client = require('../../database/index.js');

//GET ALL RESERVATIONS FOR A SPECIFIC PROPERY
const getReservations = (property, cb) => {
  let query = `SELECT * FROM reservations WHERE property_id = ${property}`

  client.execute(query, (err, result) => {
    if (err) {
      console.log('could not get reservations');
      cb(err)
    } else {
      // console.log('got the data', result.rows);
      cb(null, result)
    }
  });
};
// console.log('doing get request');
// getReservations(9999999);
// console.log('finished get request');

//CREATE A RESERVATION
//ADD TO BOTH RESERVATION_INFO AND RESERVATIONS
const createReservations = ({ reservation_id, property_id, total_price, total_guests, dates }, cb) => {
  //add to reservations_info
  let query = `INSERT INTO calendar.reservationinfo (reservation_id,property_id, total_guests, total_price) VALUES ('${reservation_id}',${property_id},${total_guests},${total_price});`

  client.execute(query, (err, result) => {
    if (err) {
      console.log('could not add to reservations info');
      // cb(err)
    } else {
      console.log('inserted into reservation_info');
      // cb(null, result)
      reservation_id = Number(reservation_id);

      for (let i = 0; i < dates.length; i++) {
        let query = `INSERT INTO calendar.reservations (property_id,booked_date) VALUES (${property_id},'${dates[i]}')`

        client.execute(query, (err, result) => {
          if (err) {
            console.log('could not add to reservations table');
            cb(err)
          } else {
            console.log('inserted into reservations');
            cb(null, result)
          }
        });
      }
    }
  });
};
// console.log('doing post request');
// createReservations(obj)
// console.log('finished post request');

//update query
//
//GET ALL RESERVATIONS FOR A SPECIFIC PROPERY
//delete all querties associated with the reservation number. use same reservation number
const deleteReservation = (info, cb) => {
  //for reservation_info. THIS WORKS
  let query = `delete from reservation_info where reservation_id = '${info.reservation_id}'`

  client.execute(query, (err, result) => {
    if (err) {
      console.log('could not get reservations');
    } else {
      console.log('reservation_info was deleted');
      console.log('initiate deleting reservations');

      let query = `delete from reservations where property_id = ${info.property_id} AND booked_date >= '${info.dates[0]}' AND booked_date <= '${info.dates[info.dates.length - 1]}`
      console.log(query)
      client.execute(query, (err, result) => {
        if (err) {
          console.log('could not delete reservation');
          // cb(err)
        } else {
          console.log('deleted reservations');
          // cb(null, result)
        }

      })

    }
  });

};

let obj = {
  reservation_id: '0',
  property_id: 0,
  total_price: 1,
  total_guests: 200,
  dates: ['2020-11-14', '2020-11-15', '2020-11-16']
}

// deleteReservation(obj)
// console.log('create reservation')
// createReservations(obj)
// console.log('delete reservation')
// deleteReservation(obj)


//delete query

exports.getReservations = getReservations;
exports.createReservations = createReservations;

