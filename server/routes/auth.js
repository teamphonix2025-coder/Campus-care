// routes/auth.js
/*
  Auth routes:
   - POST /api/auth/signup  -> create user, generate OTP, send email
   - POST /api/auth/verify  -> verify OTP for email verification
   - POST /api/auth/login   -> check credentials, return JWT
   - POST /api/auth/forgot  -> generate OTP for password reset and email it
   - POST /api/auth/reset   -> reset password using OTP
*/

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

// Helper to generate 6-digit OTP
function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---------------- SIGNUP ----------------
router.post("/signup", async (req, res) => {
  try {
    const { realName, nickname, college, email, password } = req.body;

    if (!realName || !nickname || !college || !email || !password) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ msg: "Email already registered" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const otp = genOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user (unverified)
    const user = new User({
      realName,
      nickname,
      college,
      email: email.toLowerCase(),
      password: hashed,
      verified: false,
      otp,
      otpExpires,
    });

    await user.save();

    // Send OTP email
    const subject = "CampusCare — verify your email";
    const text = `Hello ${nickname},\n\nYour verification OTP is: ${otp}\nThis code expires in 10 minutes.\n\nIf you didn't request this, ignore this email.`;

    const previewUrl = await sendMail({
      to: email,
      subject,
      text,
      html: `<p>Hello ${nickname},</p><p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });

    return res.status(201).json({
      msg: "Signup successful. Check your email for OTP.",
      debugPreviewUrl: previewUrl, // Will be Ethereal link in dev
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- VERIFY OTP ----------------
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ msg: "Missing email or otp" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (!user.otp || !user.otpExpires) return res.status(400).json({ msg: "No OTP pending" });
    if (user.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });
    if (user.otpExpires < new Date()) return res.status(400).json({ msg: "OTP expired" });

    // Mark verified
    user.verified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.json({ msg: "Email verified. You can now login." });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Missing fields" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (!user.verified) return res.status(401).json({ msg: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign({ id: user._id, nickname: user.nickname }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    return res.json({ token, nickname: user.nickname });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- FORGOT PASSWORD (send OTP) ----------------
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Missing email" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = genOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const subject = "CampusCare — password reset OTP";
    const text = `Hi ${user.nickname},\n\nYour password reset OTP is: ${otp}\nIt expires in 10 minutes.`;

    const previewUrl = await sendMail({ to: email, subject, text });

    return res.json({ msg: "Password reset OTP sent", debugPreviewUrl: previewUrl });
  } catch (err) {
    console.error("Forgot error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- RESET PASSWORD ----------------
router.post("/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ msg: "Missing fields" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (!user.otp || user.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });
    if (user.otpExpires < new Date()) return res.status(400).json({ msg: "OTP expired" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
