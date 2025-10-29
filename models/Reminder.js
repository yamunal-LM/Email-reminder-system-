const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  email: String,
  title: String,
  message: String,
  dateTime: Date,
  sent: { type: Boolean, default: false },
});

module.exports = mongoose.model("Reminder", reminderSchema);
