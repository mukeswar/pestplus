const twilio = require('twilio');
const accountSid = 'TWILIO_ACCOUNT_SID'; // replace with actual SID
const authToken = 'TWILIO_AUTH_TOKEN';   // replace with actual token
const client = twilio(accountSid, authToken);

function sendAlert(region, pest, humidity) {
  const message = `\u26a0\ufe0f ${pest} risk in ${region} (Humidity ${humidity}%). Act now.`;
  return client.messages.create({
    body: message,
    from: '+1234567890', // your Twilio number
    to: '+9779876543210' // destination number
  });
}

module.exports = { sendAlert };
