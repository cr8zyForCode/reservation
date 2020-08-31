const fs = require('fs');
const moment = require('moment');
const csvWriter = require('csv-write-stream');
const writer = csvWriter();

//--------properties--------
function createProperties(i, writer, encoding, callback) {
  let largeNumber = [61, 23, 45, 98, 14, 19, 91, 92, 93, 95];
  let smallNumber = [1, 2, 3, 4, 5];

  let id = 0;
  function write() {
    let ok = true;
    do {
      i -= 1;
      id += 1;
      let data = `${id}, ${largeNumber[i % 10]
        }, ${smallNumber[i % 5]}, ${largeNumber[i % 10]}, ${smallNumber[i % 5]}, ${smallNumber[i % 3] + 4} \n`;
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write()
};

//--------reservations--------
function createReservations(i, writer, encoding, callback, idCallback) {
  let reservationsIds = [];

  let property_id = 0;
  let currentDate = moment().format('YYYY-MM-DD');
  let daysPerReservation = 5
  let lastDate = moment(currentDate).add(daysPerReservation, 'days').format('YYYY-MM-DD');
  let numOfReservationsPerProperty = 5

  function write() {
    let ok = true;
    do {

      i += 1;

      while (i > property_id) {
        // console.log('new while loop')
        let reservation_id = `${property_id}x${currentDate}x${lastDate}`;
        // console.log(reservation_id)
        for (let j = 0; j <= daysPerReservation; j++) {
          let newReservationDate = moment(currentDate).add(j, 'days').format('YYYY-MM-DD');
          // console.log(newReservationDate, 'new reservation day')
          let data = `${property_id}, ${reservation_id}, ${newReservationDate}\n`

          if (i === 0) {
            writer.write(data, encoding, callback);
          } else {
            ok = writer.write(data, encoding);
          }
        }
        reservationsIds.push(reservation_id);

        if (numOfReservationsPerProperty !== 0) {
          currentDate = moment(lastDate).add(3, 'days').format('YYYY-MM-DD');
          lastDate = moment(currentDate).add(daysPerReservation, 'days').format('YYYY-MM-DD');
          numOfReservationsPerProperty--;
        } else {
          currentDate = moment().format('YYYY-MM-DD');
          lastDate = moment(currentDate).add(daysPerReservation, 'days').format('YYYY-MM-DD');
          numOfReservationsPerProperty = 5;
          property_id++;
        }
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write()
  idCallback(reservationsIds)
}

//--------reservation info--------
function createReservationInfo(i, writer, encoding, callback, array) {
  function write() {
    let ok = true;
    do {
      i -= 1;
      let reservationId = array[i];
      let splitReservationId = array[i].split('x');

      const data = `${reservationId}, ${splitReservationId[0]}, ${splitReservationId[1]}, ${splitReservationId[2]}, ${100},${((i % 5) + 2)}\n`;

      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }

    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write()
};

function doEverything() {
  return new Promise((resolve, reject) => {
    console.log('initiating all of the seeding')
    resolve()
  })
}

doEverything()
  .then(() => {
    console.log('initiating properties seed')

    const writeUsers = fs.createWriteStream('properties.csv');
    writeUsers.write('id, nightly_fee,rating,reviews,min_stay,max_guests\n', 'utf8');

    createProperties(10, writeUsers, 'utf-8', () => {
      writeUsers.end();
    });

  })
  .then(() => {
    console.log('completed properties seed');
    console.log('initiating reservations seed');

    const writeUsers = fs.createWriteStream('reservations.csv');
    writeUsers.write('property_id, reservation_id, booked_date\n', 'utf8');
    let reservationId;

    createReservations(10, writeUsers, 'utf-8', () => {
      writeUsers.end();
    }, (array) => { reservationId = array })

    return reservationId
  })
  .then((reservationId) => {
    console.log('completed reservations seed');
    console.log('initiating reservation info seed');

    const writeUsers = fs.createWriteStream('reservationInfo.csv');
    writeUsers.write('reservation_id, property_id, start_date, end_date, total_price, total_guests\n', 'utf8');

    createReservationInfo(reservationId.length, writeUsers, 'utf-8', () => { writeUsers.end() }, reservationId);
    console.log('completed reservation info seed');
  })
  .catch(console.log)




  //--------play code--------

// function createProperties(entries) {
//   return new Promise((resolve, reject) => {
//     console.log('initiating properties seed')

//     writer.on('error', function (error) {
//       reject(error);
//     });
//     // The 'finish' event is emitted after the writer.end() method has been called
//     writer.on('finish', function (data) {
//       resolve(data);
//     })

//     let propertiesData = `nightly_fee, rating, reviews, min_stay, max_guests\n`;
//     let largeNumber = [61, 23, 45, 98, 14, 19, 91, 92, 93, 95];
//     let smallNumber = [1, 2, 3, 4, 5];

//     writer.pipe(fs.createWriteStream('properties.csv'));

//     for (let i = 1; i <= entries; i++) {

//       writer.write({
//         'nightly_fee': largeNumber[i % 10],
//         'rating': smallNumber[i % 5],
//         'reviews': largeNumber[i % 10],
//         'min_stay': smallNumber[i % 5],
//         'max_guests': smallNumber[i % 3] + 4,
//       });

//     }
//     writer.end();
//   })
// };


//--------reservations table--------
//layout: id is incremented, [property_id, reservation_id, booked_date]
// function createReservations(entries) {
//   return new Promise((resolve, reject) => {
//     console.log('initiating reservations seed')

//     let reservationsIds = [];

//     writer.on('error', (error) => {
//       reject(error);
//     });
//     // The 'finish' event is emitted after the writer.end() method has been called
//     writer.on('finish', () => {
//       resolve(reservationsIds);
//     })

//     writer.pipe(fs.createWriteStream('reservations.csv'));

//     let property_id = 0;
//     let numberOfReservations = 5;

//     let currentDate = moment().format('YYYY-MM-DD');
//     let numOfStay = 6
//     let lastDate = moment(currentDate).add(numOfStay, 'days').format('YYYY-MM-DD');

//     while (property_id < entries) {
//       let reservation_id = `${property_id} x${currentDate} x${lastDate} `;

//       for (let i = 0; i < numberOfReservations; i++) {
//         let newReservationDate = moment(currentDate).add(i, 'days').format('YYYY-MM-DD');

//         writer.write({
//           'property_id': property_id,
//           'reservation_id': reservation_id,
//           'booked_date': newReservationDate
//         });
//       }
//       reservationsIds.push(reservation_id);

//       property_id++;
//       currentDate = moment(lastDate).add(3, 'days').format('YYYY-MM-DD');
//       lastDate = moment(currentDate).add(numOfStay, 'days').format('YYYY-MM-DD');
//     }
//     writer.end();
//   })
// };

//--------reservations info table--------
// function createReservationInfo(array) {
//   return new Promise((res, rej) => {

//     writer.pipe(fs.createWriteStream('reservationInfo.csv'));

//     for (let i = 0; i < array.length; i++) {
//       let reservationId = array[i];
//       let splitReservationId = array[i].split('x');

//       writer.write({
//         'reservation_id': reservationId,
//         'property_id': splitReservationId[0],
//         'start_date': splitReservationId[1],
//         'end_date': splitReservationId[2],
//         'total_price': 100,
//         'total_occupants': ((i % 5) + 2)
//       });
//     }
//     writer.end();
//   })
// };

// createProperties(1000000)
//   .then(() => {
//     console.log('finsihed properties seed')
//   })
//   .catch(console.log)

// createReservations(1000)
//   .then((array) => {
//     console.log(array, 'reservation ids')
//     console.log('finsihed reservations seed')

//     createReservationInfo(array)
//       .then(() => { console.log('finsihed reservation information seed') })
//       .catch(console.log)
//   })
//   .catch(console.log)