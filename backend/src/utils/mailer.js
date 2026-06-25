let nodemailer;
let transporter;

try {
  nodemailer = require("nodemailer");
  // Create a mock/transport logic depending on environment
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com",
      pass: process.env.EMAIL_PASS || "your-app-password",
    },
  });
} catch (error) {
  console.warn("Nodemailer is not installed. Email notifications will be mocked.");
}

const sendTrackingEmail = async (to, subject, html) => {
  if (!to) return; // Silent return if no email provided

  const mailOptions = {
    from: `"ShipNex Notifications" <${process.env.EMAIL_USER || "noreply@shipnex.com"}>`,
    to,
    subject,
    html,
  };

  try {
    // In local development, if EMAIL_USER isn't set, or if nodemailer isn't installed, we just console log it to avoid crash
    if (!process.env.EMAIL_USER || !transporter) {
      console.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
      console.log(`[Mock Email Content]: ${html}`);
      return;
    }
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = {
  sendTrackingEmail,
};
