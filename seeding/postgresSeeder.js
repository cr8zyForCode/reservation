const fs = require('fs');
const moment = require('moment');
//--------properties table--------
//layout: id is incremented, [nightly_fee, rating, review, min_stay, max_guests]
//create 10 properties
//set nighly fee largeNumber
//set rating smallNumber
//set total reviews largeNUmber
//set minumum stay smallNumber
//set max_guests smallNumber

function writeProperties() {
  let propertiesData = `nightly_fee, rating, reviews, min_stay, max_guests\n`;
  let largeNumber = [61, 23, 45, 98, 14, 19, 91, 92, 93, 95];
  let smallNumber = [1, 2, 3, 4, 5];

  for (let i = 0; i < 1000; i++) {
    propertiesData += `${largeNumber[i % 10]}, ${smallNumber[i % 5]}, ${largeNumber[i % 10]}, ${smallNumber[i % 5]}, ${smallNumber[i % 5]}\n`
  }

  return new Promise((res, rej) => {
    fs.writeFile('./properties.csv', propertiesData, (err) => {
      if (err) {
        rej(err)
      } else {
        res('we did it')
      }
    })
  })
};

writeProperties();

//--------reservations table--------
//layout: id is incremented, [property_id, reservation_id, booked_date]
function writeReservations() {
  let reservationsIds = [];
  //for each property_id, there needs to be 8 reservations
  let propertiesData = `property_id, reservation_id, booked_date\n`;

  let property_id = 0;
  let numberOfReservations = 5;

  let currentDate = moment().format('YYYY-MM-DD');
  let numOfStay = 6
  let lastDate = moment(currentDate).add(numOfStay, 'days').format('YYYY-MM-DD');

  while (property_id < 1000) {
    let reservation_id = `${property_id}x${currentDate}x${lastDate}`;

    for (let i = 0; i < numberOfReservations; i++) {
      let newReservationDate = moment(currentDate).add(i, 'days').format('YYYY-MM-DD');
      propertiesData += `${property_id}, ${reservation_id}, ${newReservationDate}\n`;
    }
    reservationsIds.push(reservation_id);

    property_id++;

    currentDate = moment(lastDate).add(3, 'days').format('YYYY-MM-DD');
    lastDate = moment(currentDate).add(numOfStay, 'days').format('YYYY-MM-DD');
  }

  return new Promise((res, rej) => {
    fs.writeFile('./reservations.csv', propertiesData, (err) => {
      if (err) {
        rej(err)
      } else {
        res(reservationsIds)
      }
    })
  })
};

//--------reservations info table--------
function writeReservationInfo(array) {
  //create string for document
  let propertiesData = `reservation_id, property_id, start_date, end_date, total_price\n`;
  //get reservationId
  for (let i = 0; i < array.length; i++) {
    let reservationId = array[i];
    let splitReservationId = array[i].split('x');
    //get property id
    let propertyId = splitReservationId[0];
    //get start date
    let startDate = splitReservationId[1];
    //get end date
    let endDate = splitReservationId[2];

    propertiesData += `${reservationId}, ${propertyId}, ${startDate}, ${endDate}, ${100}\n`;
  }

  return new Promise((res, rej) => {
    fs.writeFile('./reservationInfo.csv', propertiesData, (err) => {
      if (err) {
        rej(err)
      }
    })
  })

};

let doEverything = () => {
  writeReservations()
    .then((array) => {
      writeReservationInfo(array)
    })
    .catch(() => {
      console.log('was there an error?')
    })
  console.log('this is the end')
}

doEverything()

//for each property_id, there needs to be 8 reservations
//create a reservationId
//for reach reservation add the dates between start date and end date