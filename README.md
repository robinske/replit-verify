# Help Me Name My New Puppy 🐾

A tiny, playful naming-contest web app. Vote for your favorite name and
watch the leaderboard update in real time.

This branch adds **phone number verification** with [Twilio Verify](https://www.twilio.com/docs/verify)
so each phone number can only vote once. For the version without
verification, see the [`main` branch](https://github.com/robinske/replit-verify/tree/main).

## How it works

1. A voter clicks "Vote" on a name and enters their phone number.
2. The server calls `verifyService.verifications.create()` to send a one-time code via SMS.
3. The voter enters the code, and the server calls `verifyService.verificationChecks.create()` to confirm it.
4. If the code is valid, the vote is recorded and that phone number is marked as having voted.

The core integration lives in `lib/verify.js` — two small functions that
wrap the Twilio Verify API.

## Setup

1. Create a [Twilio account](https://www.twilio.com/try-twilio) and a
   [Verify Service](https://www.twilio.com/docs/verify/quickstart) in the
   [Twilio Console](https://console.twilio.com/us1/develop/verify/services).
2. Copy `.env.example` to `.env` and fill in your credentials:

   ```bash
   cp .env.example .env
   ```

   ```
   TWILIO_ACCOUNT_SID=       # found on your Twilio Console dashboard
   TWILIO_API_KEY=           # create one at console.twilio.com/us1/account/keys-credentials/api-keys, starts with "SK"
   TWILIO_API_SECRET=        # shown once when you create the API key — copy it then
   TWILIO_VERIFY_SERVICE_SID=  # found on your Verify Service page, starts with "VA"
   ```

   On Replit, add these as [Secrets](https://docs.replit.com/replit-workspace/workspace-features/secrets) instead of a `.env` file.

## Run it on Replit

Replit's GitHub import doesn't support linking directly to a branch, so
import the repo normally and switch to the `twilio-verify` branch once
it's open:

[![Run on Replit](https://replit.com/badge/github/robinske/replit-verify)](https://replit.com/github.com/robinske/replit-verify)

## Run it locally

```bash
npm install
npm start
```

Then open http://localhost:3000.

## Stack

- Express server with in-memory storage (`server.js`)
- Twilio Verify for phone number verification (`lib/verify.js`)
- Static HTML/CSS/JS frontend (`public/`)
- No database, no user accounts — just names, vote counts, and a set of verified phone numbers
