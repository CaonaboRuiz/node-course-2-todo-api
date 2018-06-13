const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

// create hash  -  to verify go https/jwt.io to decode the generate hash
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTUyODMzNjM5Nn0.3oGO_ltjFWghzFS0t1XXz9x7emKHvh5alI0urdtlwlA
// Header {"alg": "HS256", "typ": "JWT"}
// Payload {"id": 10, "iat": 1528336396} - iat => issue at timestamp
// Signature (HMACSHA256) and enter the salt secret '123abc'
var token = jwt.sign(data, '123abc')
console.log(token);

// take token and secret and verify
var decode = jwt.verify(token, '123abc');
console.log('decode', decode);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // If someone intercept and change the data and not having the salt (+ 'somesecret'), it will failed!.
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed.  Do not trust!');
// }
