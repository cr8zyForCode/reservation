const db = require('./index.js');
const moment = require('moment');

// create a function that generate 100 individual rooms and insert into rooms table
const generateRooms = function (callback) {
  // iterate over 100 times
  // i repesent room id, so need to start at 1
  for (let i = 1; i <= 10; i++) {
    // generate data for a room
    let nightly_fee = Math.floor(Math.random() * 251) + 50; // between 50 and 300 dollars
    let rating = Math.random() * (5 - 3.8) + 3.8; // between 3.80 and 5 (exclusive) points
    let reviews = Math.floor(Math.random() * 296) + 5; // between 5 and 300 reviews
    let minimum_stay = Math.floor(Math.random() * 3) + 1; // between 1 and 3 nights
    let maximum_guest = 0;
    // if nightly_fee is less than 100
    if (nightly_fee <= 100) {
      // set maximum guest to 1 and 3
      maximum_guest = Math.floor(Math.random() * 3) + 1;
      // if nightly_fee is larger than 100 and less than 200
    } else if (nightly_fee > 100 && nightly_fee <= 200) {
      // set maximum guest to 2 and 6
      maximum_guest = Math.floor(Math.random() * 5) + 2;
    } else {
      // set maximum guest to 2 and 8
      maximum_guest = Math.floor(Math.random() * 7) + 2;
    }
    // declare query string
    let queryString = 'INSERT INTO rooms (nightly_fee, rating, reviews, minimum_stay, maximum_guest) VALUES (?, ?, ?, ?, ?)';
    // declare query params
    let queryParams = [nightly_fee, rating, reviews, minimum_stay, maximum_guest];
    // insert data into rooms table by mysql query function
    db.connection.query(queryString, queryParams, (error, results, fields) => {
      if (error) {
        console.log(`Failed to insert room ${i} to rooms table: `, error);
      } else {
        console.log(`Succeed to insert room ${i} to rooms table`);
        callback(i, minimum_stay);
      }
    });
  }
}


// create a function that generate 1 to 15 reservations for input roomID and insert into reservations table
// const generateReservations = function (roomID, minimumStay) {
//   // create an array to store the all booked_dates for the input roomID
//   let dates = [];
//   // generate a random number of reservations between 1 and 15 for the input roomID
//   let numOfReservation = Math.floor(Math.random() * 15) + 1;
//   // iterate over the number of reservations
//   for (let i = 0; i < numOfReservation; i++) {
//     // generate a random booked_date that between today and next 180 days for the current reservation
//     // Math.random() * (max - min)) + min -> Math.random() * (Day after half year - Today)) + Today
//     let dateAfterHalfYear = new Date(moment().add(90, 'days'));
//     console.log('date now plus 90 days', dateAfterHalfYear);
//     let booked_date = new Date(Math.random() * (moment(dateAfterHalfYear) - moment()) + moment());
//     console.log('date between now and 90 days', booked_date)
//     // convert the booked_date format to the proper format of a DATE in MySQL database: YYYY-MM-DD
//     booked_date = moment(booked_date).format('YYYY-MM-DD');
//     console.log('update the booked_date with the new formatting', booked_date)
//     // while the booked_date is already exist in the dates array
//     while (dates.includes(booked_date)) {
//       // regenerate and convert a random booked_date that between today and next 180 days for the current reservation
//       booked_date = moment(new Date(Math.random() * (moment(dateAfterHalfYear) - moment()) + moment())).format('YYYY-MM-DD');;
//     }
//     // generate a random number of stay between minimumStay and 10 for the current reservation
//     let numOfStay = Math.floor(Math.random() * (10 - minimumStay + 1)) + minimumStay;
//     // iterate over the number of stay
//     for (let j = 0; j < numOfStay; j++) {
//       // push the booked_date to the dates array
//       dates.push(booked_date);
//       // add one day to the booked_date
//       booked_date = moment(booked_date).add(1, 'days').format('YYYY-MM-DD');
//     }
//   }

//   let reserveId = `${dates[0]}j${dates[dates.length - 1]}`;
//   console.log(reserveId)
//   // After get all booked dates for this the input roomID, iterate over the dates array
//   for (let i = 0; i < dates.length; i++) {
//     // declare query string
//     let queryString = 'INSERT INTO reservations (room_id, booked_date) VALUES (?, ?)';
//     // declare query params
//     let queryParams = [reservationID, roomID, dates[i]];
//     // insert current date into reservations table where room_id is equal to the input roomID by mysql query function
//     db.connection.query(queryString, queryParams, (error, results, fields) => {
//       if (error) {
//         console.log(`Failed to insert data to reservations table where room id = ${roomID}: `, error);
//       } else {
//         console.log(`Success to insert data to reservations table where room id = ${roomID}`);
//       }
//     });
//   }
// }


let generateReservations = (roomId, minStay) => {
  //create an array with total dates
  let totalDates = [];
  //get current date
  let currentDate = moment().format('YYYY-MM-DD');
  //number of days for reservation
  let numOfStay = Math.floor(Math.random() * minStay) + 4;
  //get the last date.
  let lastDate = moment(currentDate).add(numOfStay, 'days').format('YYYY-MM-DD');

  let numOfReservation = 5;

  while (numOfReservation !== 0) {
    let reservationId = `${roomId}x${currentDate}x${lastDate}`;
    //numOfStay. create a number between min stays + extra for days at location. use the min stay number
    for (let i = 0; i <= numOfStay; i++) {
      let newReservationDate = moment(currentDate).add(i, 'days').format('YYYY-MM-DD');
      console.log(newReservationDate, 'current date plus i', i);
      totalDates.push([reservationId, newReservationDate]);
    };
    //after creating all dates change start, end, numOfStay
    let random = Math.floor(Math.random() * 5) + 5;
    currentDate = moment(lastDate).add(random, 'days').format('YYYY-MM-DD');
    numOfStay = Math.floor(Math.random() * minStay) + 3;
    lastDate = moment(currentDate).add(numOfStay, 'days').format('YYYY-MM-DD');
    numOfReservation--;
  }

  console.log('all dates', totalDates)

  for (let i = 0; i < totalDates.length; i++) {
    // declare query string
    let queryString = 'INSERT INTO reservations (res_id, room_id, booked_date) VALUES (?, ?, ?)';
    // declare query params
    let queryParams = [totalDates[i][0], roomId, totalDates[i][1]];

    db.connection.query(queryString, queryParams, (error, results, fields) => {
      if (error) {
        console.log(`Failed to insert data to reservations table where room id = ${roomId}: `, error);
      } else {
        console.log(`Success to insert data to reservations table where room id = ${roomId}`);
      }
    });
  }

}

generateRooms(generateReservations);

