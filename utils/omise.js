const omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

console.log(process.env.OMISE_PUBLIC_KEY);
console.log(process.env.OMISE_SECRET_KEY);
module.exports = omise;
