//install cassandra
const cassandra = require('cassandra-driver');

// const client = new cassandra.Client({
//   contactPoints: ['host1', 'host2'],
//   localDataCenter: 'datacenter1'
// });

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  keyspace: 'calendar',
  localDataCenter: 'datacenter1'
});

client.connect((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('connected to cassandra')
  }
  // assert.ifError(err);
});

// const query = "SELECT * FROM reservations WHERE property_id = 9999999";

// client.execute(query, function (err, result) {
//   // var reservations = result.first();
//   //The row is an Object with column names as property keys.
//   console.log('objectOfReservations', result.rows);
// });
module.exports = client;