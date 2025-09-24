// src/components/LoaderOverlay.jsx
import React from "react";
import CircleLoader from "react-spinners/CircleLoader";
import "../Styles/LoaderOverlay.css";

export default function LoaderOverlay({ loading }) {
  if (!loading) return null; // don’t render if loading is false
  return (
    <div className="loader-overlay">
      <CircleLoader size={80} color="#36d7b7" />
    </div>
  );
}
