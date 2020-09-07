const fs = require('fs');
const moment = require('moment');

const bashArguments = process.argv.slice(2);

function createProperties(property_id, writer, encoding, callback, i) {
  let largeNumber = [61, 23, 45, 98, 14, 19, 91, 92, 93, 95];
  let smallNumber = [1, 2, 3, 4, 5];


  function write() {
    let ok = true;
    do {
      i -= 1;
      while (i >= property_id) {

        let data = `${property_id},${smallNumber[property_id % 5]},${smallNumber[property_id % 5]},${largeNumber[property_id % 10]},${smallNumber[property_id % 5]},${largeNumber[property_id % 10]}\n`;

        if (i === 0) {
          writer.write(data, encoding, callback);
        } else {
          ok = writer.write(data, encoding);
        }

        property_id++

      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write()
};

//file number, start, end, pad1 pad2
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

const writeUsers = fs.createWriteStream(`properties${fileNum}.csv`);

writeUsers.write('id, max_guests, min_stay, nightly_fee,rating,reviews,\n', 'ascii');

createProperties(start, writeUsers, 'ascii', () => {
  writeUsers.end();
}, end)