import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import Navbar from "./Navbar";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";

    let score = 0;
    let feedback = [];

    if (password.length >= 8) score++;
    else feedback.push("At least 8 characters");

    if (/[a-z]/.test(password)) score++;
    else feedback.push("Lowercase letter");

    if (/[A-Z]/.test(password)) score++;
    else feedback.push("Uppercase letter");

    if (/[0-9]/.test(password)) score++;
    else feedback.push("Number");

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push("Special character");

    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Good";
    return "Strong";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Check password strength in real-time
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength === "Weak") {
      newErrors.password =
        "Password is too weak. Please use a stronger password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/signup",
        formData
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      alert("Signup successful. Redirecting to login...");
      navigate("/login");
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "Weak":
        return "#ff4444";
      case "Fair":
        return "#ff8800";
      case "Good":
        return "#ffbb33";
      case "Strong":
        return "#00C851";
      default:
        return "#ccc";
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <form className="signup-box" onSubmit={handleSignup}>
          <div className="signup-icon">🍃</div>
          <h2>Create an Account</h2>
          <p>Begin your journey to wellness with AyuMeet.</p>

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? "error" : ""}
            required
          />
          {errors.fullName && (
            <span className="error-message">{errors.fullName}</span>
          )}

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            required
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
            required
          />

          {/* Password strength indicator */}
          {formData.password && (
            <div className="password-strength">
              <span>Password Strength: </span>
              <span
                className="strength-indicator"
                style={{ color: getPasswordStrengthColor() }}
              >
                {passwordStrength}
              </span>
            </div>
          )}

          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={isSubmitting ? "submitting" : ""}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <p className="switch-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;
