const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, unique: true, index: true },
  longUrl: { type: String, required: true },
  visits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Url", UrlSchema);
