import React, { useEffect, useRef, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CircleLoader from "react-spinners/CircleLoader";
import LoaderOverlay from "./LoaderOverlay";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // password strength score 0..4
  const pwScore = () => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const strengthClass = () =>
    `strength-${Math.max(0, Math.min(4, pwScore()))}`;

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    console.log("loading:",loading);
    setLoading(true);
    
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      if (res.data.nickname) {
        localStorage.setItem("nickname", res.data.nickname);
      }
      if (remember) localStorage.setItem("remember", "true");
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.msg || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    
     

    <div className="login-container">
      <LoaderOverlay loading={loading} />
      <form className="login-form" onSubmit={handleLogin} noValidate>
        <h2>Login</h2>

        {msg && (
          <div className="error" role="alert" aria-live="assertive">
            {msg}
          </div>
        )}

        {/* Email */}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          ref={emailRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />

        {/* Password with toggle */}
        <label htmlFor="password">Password</label>
        <div className="password-input">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          aria-describedby={password ? "pw-strength" : undefined}
        />
        <span
          className="toggle-password"
          onClick={() => setShowPassword((s) => !s)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>


        {/* strength bar */}
        <div id="pw-strength" className="strength-bar" aria-hidden>
          <div className={`strength ${strengthClass()}`} />
        </div>

        {/* Remember me + forgot link */}
        <div className="remember-me">
          <label className="remember-label">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <Link to="/forgot" className="forgot-link">
            Forgot?
          </Link>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}>
          Login
        </button>

        {/* Sign up link */}
        <div className="small-links">
          <span>New here? </span>
          <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>

  );
}
