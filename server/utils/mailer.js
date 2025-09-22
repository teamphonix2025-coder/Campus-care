const nodemailer = require("nodemailer");

async function sendMail({ to, subject, text, html }) {
  let transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    // ✅ Use Ethereal when no real SMTP creds
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    // ✅ Real SMTP (e.g. Gmail if creds are set)
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Send email
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });

  // 👇 This is the preview URL for Ethereal
  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log("📧 Preview email URL:", previewUrl);

  return previewUrl; // return link so auth.js can use it
}

module.exports = { sendMail };

/*// utils/mailer.js
// Creates a transporter (SMTP). If real SMTP is not provided via .env,
// we create an Ethereal account for development (previewable email).

const nodemailer = require('nodemailer');

async function getTransporter() {
  // If developer provided SMTP credentials, use them (Gmail / other)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Otherwise create a test account with Ethereal.email (dev only).
  // Ethereal gives you a preview URL to view the email in browser.
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
}

// sendMail helper returns an object { info, previewUrl (if Ethereal) }
async function sendMail({ to, subject, text, html }) {
  const transporter = await getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@example.com';

  const info = await transporter.sendMail({ from, to, subject, text, html });

  // nodemailer.getTestMessageUrl(info) returns preview url for Ethereal only
  const previewUrl = nodemailer.getTestMessageUrl(info) || null;

  return { info, previewUrl };
}

module.exports = { sendMail, getTransporter };
*/