const fs = require('fs');
const moment = require('moment');
//--------reservations--------
function createReservations(property_id, writer, encoding, callback, i) {

  let currentDate = moment().format('YYYY-MM-DD');
  let daysPerReservation = 5
  let lastDate = moment(currentDate).add(daysPerReservation, 'days').format('YYYY-MM-DD');
  let numOfReservationsPerProperty = 5
  let array = [0, 1, 2, 3, 4, 5];
  // let resID = 0;

  function write() {
    let ok = true;
    do {

      i -= 1;

      while (i >= property_id) {

        //create reservation dates
        let newReservationDate0 = moment(currentDate).add(0, 'days').format('YYYY-MM-DD');
        let newReservationDate1 = moment(currentDate).add(1, 'days').format('YYYY-MM-DD');
        let newReservationDate2 = moment(currentDate).add(2, 'days').format('YYYY-MM-DD');
        let newReservationDate3 = moment(currentDate).add(3, 'days').format('YYYY-MM-DD');
        let newReservationDate4 = moment(currentDate).add(4, 'days').format('YYYY-MM-DD');
        let newReservationDate5 = moment(currentDate).add(5, 'days').format('YYYY-MM-DD');
        //create strings for each reservation date
        let reservationDates0 = `${property_id},${newReservationDate0}\n`
        let reservationDates1 = `${property_id},${newReservationDate1}\n`
        let reservationDates2 = `${property_id},${newReservationDate2}\n`
        let reservationDates3 = `${property_id},${newReservationDate3}\n`
        let reservationDates4 = `${property_id},${newReservationDate4}\n`
        let reservationDates5 = `${property_id},${newReservationDate5}\n`

        let data = reservationDates0 + reservationDates1 + reservationDates2 + reservationDates3 + reservationDates4 + reservationDates5;
        //each property has 5 reservations 5 days long each. Switches to a new property once it reaches zero
        if (numOfReservationsPerProperty !== 0) {
          currentDate = moment(lastDate).add(3, 'days').format('YYYY-MM-DD');
          lastDate = moment(currentDate).add(daysPerReservation, 'days').format('YYYY-MM-DD');
          numOfReservationsPerProperty--;
        } else {
          currentDate = moment().format('YYYY-MM-DD');
          lastDate = moment(currentDate).add(daysPerReservation, 'days').format('YYYY-MM-DD');
          numOfReservationsPerProperty = 5;
          dates = 0;
          property_id++;
        }


        if (i < 0) {
          writer.write(data, encoding, callback);
        } else {
          ok = writer.write(data, encoding);
        }

      }
    } while (i >= 0 && ok);
    if (i >= 0) {
      writer.once('drain', write);
    }
  }
  write()
}

const bashArguments = process.argv.slice(2);

let fileNum = bashArguments[0];
let start = bashArguments[1];
let end = bashArguments[2];
let pad1 = Number(bashArguments[3])
let pad2 = Number(bashArguments[4])

if (Number(start) >= 9) {
  pad2++
}

start = Number(start.padEnd(pad1, '0'));
end = Number(end.padEnd(pad2, '0'));

const writeUsers = fs.createWriteStream(`reservations${fileNum}.csv`);
writeUsers.write('property_id,booked_date\n', 'ascii');

console.log('start reservation seed 1')
createReservations(start, writeUsers, 'ascii', () => {
  writeUsers.end();
}, end)
