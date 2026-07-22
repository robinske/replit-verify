require("dotenv").config({ quiet: true });
const express = require("express");
const path = require("path");
const { sendVerificationCode, checkVerificationCode } = require("./lib/verify");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const names = [
  { id: 1, name: "Tuna Fish", votes: 5 },
  { id: 2, name: "Small Bear", votes: 3 },
  { id: 3, name: "Miss Jenkins", votes: 1 },
];

// Tracks which phone numbers have already voted, to enforce one vote per number.
const votedPhoneNumbers = new Set();

app.get("/api/names", (req, res) => {
  const sorted = [...names].sort((a, b) => b.votes - a.votes);
  res.json(sorted);
});

app.post("/api/verify/send", async (req, res) => {
  const phoneNumber = typeof req.body.phoneNumber === "string" ? req.body.phoneNumber.trim() : "";

  if (!phoneNumber) {
    return res.status(400).json({ error: "A phone number is required." });
  }
  if (votedPhoneNumbers.has(phoneNumber)) {
    return res.status(400).json({ error: "This phone number has already voted." });
  }

  try {
    await sendVerificationCode(phoneNumber);
    res.status(200).json({ sent: true });
  } catch (err) {
    res.status(400).json({ error: "Could not send a verification code to that number." });
  }
});

app.post("/api/names/:id/vote", async (req, res) => {
  const id = Number(req.params.id);
  const entry = names.find((n) => n.id === id);
  const phoneNumber = typeof req.body.phoneNumber === "string" ? req.body.phoneNumber.trim() : "";
  const code = typeof req.body.code === "string" ? req.body.code.trim() : "";

  if (!entry) {
    return res.status(404).json({ error: "Name not found." });
  }
  if (!phoneNumber || !code) {
    return res.status(400).json({ error: "A phone number and verification code are required." });
  }
  if (votedPhoneNumbers.has(phoneNumber)) {
    return res.status(400).json({ error: "This phone number has already voted." });
  }

  let approved;
  try {
    approved = await checkVerificationCode(phoneNumber, code);
  } catch (err) {
    return res.status(400).json({ error: "Could not check that verification code." });
  }

  if (!approved) {
    return res.status(400).json({ error: "Incorrect or expired verification code." });
  }

  votedPhoneNumbers.add(phoneNumber);
  entry.votes += 1;
  res.json(entry);
});

app.listen(PORT, () => {
  console.log(`Puppy naming contest running on port ${PORT}`);
});
