let client = require('../../database/index.js');

//GET ALL RESERVATIONS FOR A SPECIFIC PROPERY
const getProperty = (property, cb) => {
  let query = `SELECT * FROM properties WHERE id = ${property}`

  client.execute(query, (err, result) => {
    if (err) {
      console.log('could not get reservations');
      cb(err)
    } else {
      // console.log('got the data', resu);
      cb(null, result)
    }
  });
};

exports.getProperty = getProperty;