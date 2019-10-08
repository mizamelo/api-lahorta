const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_KEY,
  apiSecret: process.env.NEXMO_SECRET
});

module.exports = nexmo;
