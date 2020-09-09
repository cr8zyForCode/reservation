//install cassandra
const cassandra = require('cassandra-driver');

// const client = new cassandra.Client({
//   contactPoints: ['host1', 'host2'],
//   localDataCenter: 'datacenter1'
// });'172.31.13.142',

var authProvider = new cassandra.auth.PlainTextAuthProvider('root', 'root');

const client = new cassandra.Client({
  contactPoints: ['54.151.34.180'],
  keyspace: 'calendar',
  authProvider: authProvider,
  localDataCenter: 'datacenter1'
});

// const client = new cassandra.Client({
//   contactPoints: ['127.0.0.1'],
//   keyspace: 'calendar',
//   authProvider: authProvider,
//   localDataCenter: 'datacenter1'
// });

client.connect((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('connected to cassandra');
  }
});

// client.execute(query, (err, result) => {
//   if (err) {
//     console.log('could not get reservations');
//     cb(err)
//   } else {
//     // console.log('got the data', resu);
//     // cb(null, result)
//   }
// });
// };


// client.execute(query, function (err, result) {
//   // var reservations = result.first();
//   //The row is an Object with column names as property keys.
//   console.log('objectOfReservations', result.rows);
// });
module.exports = client;

// var assert = require('assert');
// //”cassandra-driver” is in the node_modules folder. Redirect if necessary.
// var cassandra = require('cassandra-driver');
// //Replace Username and Password with your cluster settings
// var authProvider = new cassandra.auth.PlainTextAuthProvider('Username', 'Password');
// //Replace PublicIP with the IP addresses of your clusters
// var contactPoints = ['PublicIP', 'PublicIP', 'PublicIP’'];
// var client = new cassandra.Client({ contactPoints: contactPoints, authProvider: authProvider, keyspace: 'grocery' });
