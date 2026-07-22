const twilio = require("twilio");

const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, TWILIO_VERIFY_SERVICE_SID } = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET || !TWILIO_VERIFY_SERVICE_SID) {
  throw new Error(
    "Missing Twilio credentials. Set TWILIO_ACCOUNT_SID, TWILIO_API_KEY, " +
      "TWILIO_API_SECRET, and TWILIO_VERIFY_SERVICE_SID in your .env file (or Replit Secrets)."
  );
}

const client = twilio(TWILIO_API_KEY, TWILIO_API_SECRET, { accountSid: TWILIO_ACCOUNT_SID });
const verifyService = client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID);

function sendVerificationCode(phoneNumber) {
  return verifyService.verifications.create({
    to: phoneNumber,
    channel: "sms",
  });
}

async function checkVerificationCode(phoneNumber, code) {
  const check = await verifyService.verificationChecks.create({
    to: phoneNumber,
    code,
  });
  return check.status === "approved";
}

module.exports = { sendVerificationCode, checkVerificationCode };
