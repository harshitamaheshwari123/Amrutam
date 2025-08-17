const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        "General Ayurveda",
        "Panchakarma",
        "Rasayana",
        "Vajikarana",
        "Kaumarbhritya",
        "Shalya Tantra",
        "Shalakya Tantra",
        "Prasuti Tantra",
        "Agada Tantra",
        "Skin & Beauty",
      ],
    },
    experience: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    patients: {
      type: Number,
      default: 0,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    modes: {
      type: [String],
      required: true,
      enum: ["Online", "Offline", "Home Visit"],
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
