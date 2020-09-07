const fs = require('fs');
const bashArguments = process.argv.slice(2);


//DONE RESERVATIONS INFO
function createReservationInfo(property_id, writer, encoding, callback, i) {
  let numOfReservations = 0;
  let prices = [100, 200, 150, 250, 300, 350, 50];
  let guests = [2, 3, 4, 5];

  function write() {
    let ok = true;
    do {

      i -= 1;

      while (i >= property_id) {

        let data = `${property_id}${numOfReservations},${property_id},${guests[numOfReservations % 4]},${prices[numOfReservations % 7]}\n`


        if (i < 0) {
          writer.write(data, encoding, callback);
        } else {
          ok = writer.write(data, encoding);
        }

        numOfReservations++;

        if (numOfReservations === 5) {
          numOfReservations = 0;
          property_id++
        }

      }
    } while (i >= 0 && ok);
    if (i >= 0) {
      writer.once('drain', write);
    }
  }
  write()
}

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

const writeUsers = fs.createWriteStream(`info-reservation${fileNum}.csv`);

writeUsers.write('reservation_id,property_id,total_guests,total_price\n', 'utf8');

createReservationInfo(start, writeUsers, 'utf-8', () => {
  writeUsers.end();
}, end)