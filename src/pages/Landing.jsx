import { useNavigate } from "react-router-dom";
import videoBg from "../assets/calm.mp4";
import "../Styles/Landing.css";
import Login from "./Login";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <video autoPlay loop muted className="bg-video">
        <source src={videoBg} type="video/mp4" />
      </video>
      <div className="overlay">
        <h1>Welcome to Campus Care</h1>
        <button onClick={() => navigate("/login")}>Next</button>
      </div>
    </div>
  );
}
