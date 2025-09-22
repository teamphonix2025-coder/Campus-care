// models/User.js
// The User schema stores everything the backend needs for auth & OTP

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  realName: { type: String, required: true },
  nickname: { type: String, required: true },
  college: { type: String, required: true },

  // email stored lowercase and must be unique
  email: { type: String, required: true, unique: true, lowercase: true },

  // password will be stored hashed using bcrypt (backend should never store plain text)
  password: { type: String, required: true },

  verified: { type: Boolean, default: false },

  // OTP for email verification or password reset. Stored temporarily.
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null }
}, { timestamps: true });

// Hide sensitive fields when converting to JSON (helps when returning user objects)
UserSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpires;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
