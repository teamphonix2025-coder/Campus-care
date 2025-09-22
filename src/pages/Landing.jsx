import React from "react";
import { useNavigate } from "react-router-dom";
import calmVideo from "../assets/calm.mp4";
import "../Styles/Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <video autoPlay loop muted>
        <source src={calmVideo} type="video/mp4" />
      </video>
      <div className="overlay">
        <h1>Welcome to Campus Care</h1>
        <button onClick={() => navigate("/login")}>Next</button>
      </div>
    </div>
  );
}
