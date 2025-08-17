const mongoose = require("mongoose");
const Doctor = require("./models/Doctor");
const TimeSlot = require("./models/TimeSlot");
require("dotenv").config();


const doctors = [
  {
    name: "Dr. Alisha Sharma",
    specialization: "General Ayurveda",
    experience: "15+ years",
    rating: 4.8,
    patients: 2500,
    consultationFee: 800,
    modes: ["Online", "Offline"],
    description:
      "Experienced Ayurvedic practitioner specializing in holistic wellness and preventive healthcare. Expert in Panchakarma therapies and lifestyle management.",
    image: "https://via.placeholder.com/400x400",
    isAvailable: true,
  },
  {
    name: "Dr. Rajesh Kumar",
    specialization: "Panchakarma",
    experience: "12+ years",
    rating: 4.6,
    patients: 1800,
    consultationFee: 1000,
    modes: ["Offline", "Home Visit"],
    description:
      "Specialized in Panchakarma detoxification therapies. Expert in treating chronic conditions through traditional Ayurvedic methods.",
    image: "https://via.placeholder.com/400x400",
    isAvailable: true,
  },
  {
    name: "Dr. Priya Singh",
    specialization: "Rasayana",
    experience: "18+ years",
    rating: 4.9,
    patients: 3200,
    consultationFee: 1200,
    modes: ["Online", "Offline", "Home Visit"],
    description:
      "Leading expert in Rasayana therapy for rejuvenation and anti-aging. Specializes in women's health and wellness.",
    image: "https://via.placeholder.com/400x400",
    isAvailable: true,
  },
  {
    name: "Dr. Amit Patel",
    specialization: "Vajikarana",
    experience: "10+ years",
    rating: 4.5,
    patients: 1200,
    consultationFee: 900,
    modes: ["Online", "Offline"],
    description:
      "Specialized in reproductive health and vitality enhancement through Ayurvedic principles and natural therapies.",
    image: "https://via.placeholder.com/400x400",
    isAvailable: true,
  },
  {
    name: "Dr. Meera Iyer",
    specialization: "Kaumarbhritya",
    experience: "14+ years",
    rating: 4.7,
    patients: 2100,
    consultationFee: 750,
    modes: ["Online", "Offline", "Home Visit"],
    description:
      "Pediatric Ayurvedic specialist with expertise in child health, nutrition, and developmental disorders.",
    image: "https://via.placeholder.com/400x400",
    isAvailable: true,
  },
];

const generateTimeSlots = (doctorId) => {
  const slots = [];
  const timeRanges = [
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "14:00", end: "15:00" },
    { start: "15:00", end: "16:00" },
    { start: "16:00", end: "17:00" },
    { start: "17:00", end: "18:00" },
  ];

  for (let day = 1; day <= 7; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);

    if (date.getDay() === 0 || date.getDay() === 6) continue;

    timeRanges.forEach(({ start, end }) => {
      slots.push({
        doctorId,
        date: new Date(date),
        startTime: start,
        endTime: end,
        isBooked: false,
        isLocked: false,
      });
    });
  }

  return slots;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    
    await Doctor.deleteMany({});
    await TimeSlot.deleteMany({});
    console.log("Cleared existing data");

    const insertedDoctors = await Doctor.insertMany(doctors);
    console.log(`Inserted ${insertedDoctors.length} doctors`);

    const allTimeSlots = [];
    insertedDoctors.forEach((doctor) => {
      const slots = generateTimeSlots(doctor._id);
      allTimeSlots.push(...slots);
    });

    await TimeSlot.insertMany(allTimeSlots);
    console.log(`Inserted ${allTimeSlots.length} time slots`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();