// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";

import "./Styles/theme.css"; 
import Landing from "./pages/Landing";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
   <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOtp />} /> {/* ✅ new route */}
    </Routes>

    </>
  );
}

export default App;
