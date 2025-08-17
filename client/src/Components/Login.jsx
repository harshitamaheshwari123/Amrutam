import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from "./Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);
      console.log(res.data.token);
      // Navigate to dashboard or homepage
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-card">
          <div className="login-icon">🍃</div>
          <h2>Welcome Back</h2>
          <p>Log in to manage your appointments and wellness journey.</p>
          <form onSubmit={handleLogin}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Log In</button>
          </form>
          <p className="signup-link">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </>
  );
}
