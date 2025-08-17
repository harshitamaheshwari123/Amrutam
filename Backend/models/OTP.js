const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    otp: {
      type: String,
      required: true,
      length: 6,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },
  },
  {
    timestamps: true,
  }
);


otpSchema.index({ appointmentId: 1 });
otpSchema.index({ expiresAt: 1 });
otpSchema.index({ isUsed: 1 });
// delted after 24 hours

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("OTP", otpSchema);
