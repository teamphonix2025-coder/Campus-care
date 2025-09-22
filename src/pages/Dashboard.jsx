// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // get nickname from localStorage
  const nickname = localStorage.getItem("nickname");

  // logout clears token + redirect
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome to Dashboard</h2>
      <p>Hello, <b>{nickname || "User"}</b> 👋</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
