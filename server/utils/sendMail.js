const nodemailer = require("nodemailer");

async function sendMail({ to, subject, text, html }) {
  let transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    // Use Ethereal when no real SMTP creds
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
    // Real Gmail SMTP (if provided in .env)
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

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });

  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  return nodemailer.getTestMessageUrl(info);
}

module.exports = sendMail;
