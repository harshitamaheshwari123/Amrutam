const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const TimeSlot = require("../models/TimeSlot");

// Get all doctors with filters
router.get("/", async (req, res) => {
  try {
    const { specialization, mode, search, rating } = req.query;

    let query = { isAvailable: true };

    // Filter by specialization
    if (specialization && specialization !== "All") {
      query.specialization = specialization;
    }

    // Filter by consultation mode
    if (mode && mode !== "All") {
      query.modes = mode;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by minimum rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    const doctors = await Doctor.find(query).sort({
      rating: -1,
      experience: -1,
    });

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

// Get doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Failed to fetch doctor" });
  }
});

// Get available time slots for a doctor on a specific date
router.get("/:id/slots", async (req, res) => {
  try {
    const { date } = req.query;
    const doctorId = req.params.id;

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const slots = await TimeSlot.find({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      isBooked: false,
      isLocked: false,
    }).sort({ startTime: 1 });

    res.json(slots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({ message: "Failed to fetch time slots" });
  }
});

module.exports = router;
