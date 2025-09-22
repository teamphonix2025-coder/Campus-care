import React, { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "../Styles/Login.css";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("nickname", res.data.nickname);
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <form
        onSubmit={handleLogin}
        className="login-form"
      >
        <h2>Login</h2>
        {msg && <p className="text-red-500 text-sm">{msg}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Login
        </button>
      <div className="helper-block">
        <p className="signup-note">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
        <p className="forgot-note">
          <Link to="/forgot-password" className="forgot-link">
            Forgot Password?
          </Link>
        </p>
      </div>


      </form>
    </div>
  );
}