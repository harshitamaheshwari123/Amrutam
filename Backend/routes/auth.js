// Backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// NOTE: do NOT rely only on a top-level cached const for JWT_SECRET
// to ensure dotenv has loaded. We'll read process.env at runtime.

router.post("/signup", async (req, res) => {
  console.log("[AUTH] /signup body:", req.body);
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (fullName.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Full name must be at least 2 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("[AUTH] /signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

router.post("/login", async (req, res) => {
  console.log("[AUTH] /login body:", req.body);
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("[AUTH] login failed - user not found:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("[AUTH] login failed - invalid password for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("[AUTH] JWT_SECRET is missing");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("[AUTH] /login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});


module.exports = router;