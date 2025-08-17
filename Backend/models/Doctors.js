const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  description: { type: String, required: true },
  experience: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  patients: { type: Number, default: 0 },
  modes: [{ type: String, enum: ["Online", "In-person"], required: true }],
  consultationFee: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  avatar: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Doctor", doctorSchema);
