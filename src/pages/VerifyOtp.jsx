// src/pages/VerifyOtp.jsx
import React, { useState } from "react";
import API from "../services/api";
import "../Styles/VerifyOtp.css";
import { useNavigate,useLocation } from "react-router-dom";
import CircleLoader from "react-spinners/CircleLoader";
import LoaderOverlay from "./LoaderOverlay.jsx";


export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // get email from query param
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const previewUrl = localStorage.getItem("otpPreviewUrl");
  console.log("Preview URL from storage:", previewUrl);


  const handleVerify = async (e) => {
    e.preventDefault();
      setMsg("");
    setLoading(true)
    try {
      const res = await API.post("/auth/verify-otp", {email: email.toLowerCase(), otp });
      setMsg("Verification successful! You can now login.");
      // redirect to login after short delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Verification failed");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <LoaderOverlay loading={loading} />
      <form onSubmit={handleVerify} className="verify-form">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
        {msg && <p className="text-red-500 text-sm">{msg}</p>}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
         <button type="submit" disabled={loading}>
          Verify
        </button>




      </form>
    </div>
  );
}
