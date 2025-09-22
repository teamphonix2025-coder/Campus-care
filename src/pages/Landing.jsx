import { useNavigate } from "react-router-dom";
import videoBg from "../assets/calm.mp4";
import "../Styles/Landing.css";
import Login from "./Login";

const Landing = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(<Login></Login>); // go to Login page when button is clicked
  };

  return (
    <div className="landing-container">
      {/* Background Video */}
      <video
        className="landing-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/assets/bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div className="landing-card">
        <h1>Welcome to Campus Camp 🌿</h1>
        <p>
          A smooth way to experience login & signup with a stunning background.
        </p>
        <button onClick={handleNext}>Next →</button>
      </div>
    </div>
  );
};