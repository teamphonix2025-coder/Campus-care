const nodemailer = require("nodemailer");

async function sendMail({ to, subject, text, html }) {
  let transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    // Use Ethereal for dev/test
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
    // Use Gmail with App Password in production
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log("✅ Gmail email sent:", info.messageId);
    return info.messageId;
  } else {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("📧 Ethereal preview URL:", previewUrl);
    return previewUrl;
  }
}

module.exports = sendMail;
