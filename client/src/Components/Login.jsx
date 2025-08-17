import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // reset error
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email: email.trim(),
        password: password.trim(),
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/"); // redirect after login
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-card">
          <div className="login-icon">&#127811;</div>
          <h2>Welcome Back</h2>
          <p>Log in to manage your appointments and wellness journey.</p>

          <form onSubmit={handleLogin} className="login-form">
            {error && <p className="error-message">{error}</p>}

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

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="signup-link">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </>
  );
}
