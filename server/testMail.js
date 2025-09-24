require("dotenv").config();
const sendMail = require("./utils/sendMail");

(async () => {
  try {
    const res = await sendMail({
      to: "yourpersonalemail@gmail.com",
      subject: "Test Email from CampusCare",
      text: "This is a plain text test email",
      html: "<h3>This is a <b>test</b> email</h3>",
    });
    console.log("Result:", res);
  } catch (err) {
    console.error("Error:", err);
  }
})();
