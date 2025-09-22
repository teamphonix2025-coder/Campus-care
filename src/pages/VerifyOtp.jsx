// src/pages/VerifyOtp.jsx
import React, { useState } from "react";
import API from "../services/api";
import "../Styles/VerifyOtp.css";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem("pendingEmail");
      const res = await API.post("/auth/verify-otp", { email, otp });
      
      setMsg(res.data.msg);

      if (res.data.success) {
        // OTP success → allow login
        localStorage.removeItem("pendingEmail");
        window.location.href = "/login";
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || "Invalid OTP");
    }
  };

  return (
    <div className="page-container">
      <div className="verify-card">
        <h2>Verify Your Email 📧</h2>
        <p className="subtitle">Enter the OTP sent to your email</p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {msg && <p className="error-msg">{msg}</p>}
          <button type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
