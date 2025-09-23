import React, { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "../Styles/Signup.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

   const handleSignup = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/signup", { 
      realName: name, 
      nickname, 
      email, 
      password, 
      college: collegeName 
    });

    console.log("Signup response:", res.data);   
    // ✅ Save preview email URL for VerifyOtp page
    if (res.data.debugPreviewUrl) {
      localStorage.setItem("otpPreviewUrl", res.data.debugPreviewUrl);
    }

    // redirect to verify page
    navigate(`/verify-otp?email=${email}`);
  } catch (err) {
    console.error("Signup error:", err.response?.data || err.message);
    setMsg(err.response?.data?.msg || "Signup failed");
  }
};

  return (
    <div className="signup-container">
      <form
        onSubmit={handleSignup}
        className="signup-form"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {msg && <p className="text-red-500 text-sm">{msg}</p>}
          <input
              type="text"
              id="realName"
              name="realName"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <input
              type="text"
              id="nickname"
              name="nickname"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <input
              type="text"
              id="college"
              name="college"
              placeholder="College Name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
              required
            />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Sign Up
        </button>
        <p className="mt-3 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}


/*
function Signup() {
  const [form, setForm] = useState({
    realName: "",
    nickname: "",
    college: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null); // store OTP preview link
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup"); // "signup" -> "verify"

  // Handle input fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit signup form
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", form);

      setMsg(res.data.msg);
      setPreviewUrl(res.data.debugPreviewUrl || null); // save preview link
      setStep("verify"); // go to OTP verify step
    } catch (err) {
      setMsg(err.response?.data?.msg || "Signup failed");
    }
  };

  // Submit OTP for verification
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/verify", {
        email: form.email,
        otp,
      });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Verification failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Signup</h2>
      <p>{msg}</p>

      {step === "signup" && (
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="realName"
            placeholder="Full Name"
            value={form.realName}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="text"
            name="nickname"
            placeholder="Nickname"
            value={form.nickname}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="text"
            name="college"
            placeholder="College"
            value={form.college}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit">Sign Up</button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <br />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {/* Show "View OTP Email" button only if previewUrl exists }
      {previewUrl && (
        <div style={{ marginTop: "10px" }}>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            <button type="button">View OTP Email</button>
          </a>
        </div>
      )}
    </div>
  );
}*/ 