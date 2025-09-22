// src/pages/VerifyOtp.jsx
import React, { useState } from "react";
import API from "../services/api";
import "../Styles/VerifyOtp.css";
import { useNavigate } from "react-router-dom";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const handleOtpVerify = async () => {
  try {
    const res = await API.post("/auth/verify-otp", { email, otp });
    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  } catch (err) {
    setMsg("Invalid OTP");
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
