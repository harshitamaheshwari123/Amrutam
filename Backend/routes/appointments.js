const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const TimeSlot = require("../models/TimeSlot");
const Doctor = require("../models/Doctor");
const OTP = require("../models/OTP");
const { auth } = require("../middleware/auth");

// --------- book appointment---------------
router.post("/book", auth, async (req, res) => {
  try {
    const { doctorId, timeSlotId, mode, notes } = req.body;
    const userId = req.user._id;

    if (!doctorId || !timeSlotId || !mode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const timeSlot = await TimeSlot.findById(timeSlotId);
    if (!timeSlot || timeSlot.isBooked || timeSlot.isLocked) {
      return res.status(400).json({ message: "Time slot not available" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    timeSlot.isLocked = true;
    timeSlot.lockedBy = userId;
    timeSlot.lockedAt = new Date();
    await timeSlot.save();

    const appointment = new Appointment({
      userId,
      doctorId,
      timeSlotId,
      date: timeSlot.date,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      mode,
      consultationFee: doctor.consultationFee,
      notes: notes || "",
    });

    await appointment.save();

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = new OTP({
      appointmentId: appointment._id,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await otp.save();

    setTimeout(async () => {
      try {
        const slot = await TimeSlot.findById(timeSlotId);
        if (slot && slot.isLocked && !slot.isBooked) {
          slot.isLocked = false;
          slot.lockedBy = null;
          slot.lockedAt = null;
          await slot.save();
        }
      } catch (err) {
        console.error("Error releasing slot:", err);
      }
    }, 5 * 60 * 1000);

    res.json({
      message: "Appointment booked successfully. Confirm with OTP.",
      appointmentId: appointment._id,
      otp: otpCode,
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Failed to book appointment" });
  }
});

// --------------- confirm appointment --------
router.post("/confirm", auth, async (req, res) => {
  try {
    const { appointmentId, otp } = req.body;
    const userId = req.user._id;

    if (!appointmentId || !otp) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.userId.toString() !== userId.toString()) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const otpRecord = await OTP.findOne({
      appointmentId,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    appointment.status = "Confirmed";
    appointment.otpVerified = true;
    await appointment.save();

    const timeSlot = await TimeSlot.findById(appointment.timeSlotId);
    if (timeSlot) {
      timeSlot.isBooked = true;
      timeSlot.appointmentId = appointment._id;
      timeSlot.isLocked = false;
      timeSlot.lockedBy = null;
      timeSlot.lockedAt = null;
      await timeSlot.save();
    }

    res.json({ message: "Appointment confirmed successfully!" });
  } catch (err) {
    console.error("Confirm appointment error:", err);
    res.status(500).json({ message: "Failed to confirm appointment" });
  }
});

// ----- get appointment ------
router.get("/my-appointments", auth, async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user._id;

    const query = { userId };
    if (status && status !== "All") query.status = status;

    const appointments = await Appointment.find(query)
      .populate("doctorId", "name specialization image")
      .populate("timeSlotId", "startTime endTime")
      .sort({ date: 1, startTime: 1 });

    res.json(appointments);
  } catch (err) {
    console.error("Fetch appointments error:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// ----- acncle appointment --------
router.post("/:id/cancel", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const appointment = await Appointment.findById(id);
    if (!appointment || appointment.userId.toString() !== userId.toString()) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    const hoursDiff = (appointmentDate - now) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      return res.status(400).json({
        message: "Appointments can only be cancelled 24 hours in advance",
      });
    }

    appointment.status = "Cancelled";
    appointment.cancellationReason = reason;
    appointment.cancelledAt = new Date();
    await appointment.save();

    const timeSlot = await TimeSlot.findById(appointment.timeSlotId);
    if (timeSlot) {
      timeSlot.isBooked = false;
      timeSlot.appointmentId = null;
      await timeSlot.save();
    }

    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("Cancel appointment error:", err);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
});

// -------  get by id ------
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const appointment = await Appointment.findById(id)
      .populate("doctorId", "name specialization image")
      .populate("timeSlotId", "startTime endTime")
      .lean();

    console.log("Fetched appointment:", appointment);
    console.log("Logged-in user:", userId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // allow admin access in future
    // if (appointment.userId.toString() !== userId.toString()) {
    //   return res
    //     .status(403)
    //     .json({ message: "You do not have access to this appointment" });
    // }

    res.json(appointment);
  } catch (err) {
    console.error("Fetch appointment error:", err);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
});

module.exports = router;
