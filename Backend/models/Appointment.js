const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    timeSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TimeSlot",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
      enum: ["Online", "Offline", "Home Visit"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Booked", "Confirmed", "Completed", "Cancelled", "Rescheduled"],
      default: "Booked",
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    cancellationReason: {
      type: String,
    },
    cancelledAt: {
      type: Date,
    },
    rescheduledTo: {
      type: Date,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ doctorId: 1, date: 1 });
appointmentSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
