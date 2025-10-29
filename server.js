// server.js
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const Reminder = require("./models/Reminder");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Setup mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API to create reminder
app.post("/api/reminders", async (req, res) => {
  try {
    const { email, title, message, dateTime } = req.body;
    const reminder = new Reminder({ email, title, message, dateTime });
    await reminder.save();
    res.json({ success: true, message: "Reminder created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CRON Job – runs every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const reminders = await Reminder.find({ sent: false, dateTime: { $lte: now } });
  for (let reminder of reminders) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reminder.email,
      subject: `Reminder: ${reminder.title}`,
      text: reminder.message,
    };

    try {
      await transporter.sendMail(mailOptions);
      reminder.sent = true;
      await reminder.save();
      console.log("Reminder sent to", reminder.email);
    } catch (error) {
      console.error("Error sending mail:", error);
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
