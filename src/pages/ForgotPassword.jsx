// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "../Styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("request");
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/forgot", { email });
      setMsg(res.data.msg);
      setPreviewUrl(res.data.debugPreviewUrl || null);
      setStep("reset");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Request failed");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/reset", { email, otp, newPassword });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Reset failed");
    }
  };

  return (
    <div className="page-container">
      <div className="bg-shape shape1"></div>
      <div className="bg-shape shape2"></div>
      <div className="bg-shape shape3"></div>

      <div className="forgot-card">
        <h2>Reset Password 🔑</h2>
        <p className="subtitle">
          Enter your email and reset your password securely
        </p>

        {step === "request" && (
          <form onSubmit={handleForgot}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Request OTP</button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleReset}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        )}

        {msg && <p className="info-msg">{msg}</p>}
        {previewUrl && (
          <div style={{ marginTop: "10px" }}>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              View OTP Email
            </a>
          </div>
        )}

        <div className="switch-link">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
