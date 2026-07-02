let nodemailer;
let transporter;

const cleanVal = (val) => val ? val.replace(/^["']|["']$/g, "").trim() : val;

try {
  nodemailer = require("nodemailer");
  
  const smtpHost = cleanVal(process.env.SMTP_HOST);
  const smtpPort = parseInt(cleanVal(process.env.SMTP_PORT || "587"), 10);
  const smtpSecure = cleanVal(process.env.SMTP_SECURE) === "true"; // true for 465, false for 587
  const emailUser = cleanVal(process.env.EMAIL_USER);
  const emailPass = cleanVal(process.env.EMAIL_PASS);

  console.log(">>> [Mailer Init] Host:", smtpHost, "| Port:", smtpPort, "| User:", emailUser, "| PassLength:", emailPass ? emailPass.length : 0);

  let transportConfig;

  if (smtpHost) {
    // Custom SMTP server configuration
    transportConfig = {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
      socketTimeout: 10000,
    };
  } else {
    // Default to Gmail service
    transportConfig = {
      service: "gmail",
      auth: {
        user: emailUser || "your-email@gmail.com",
        pass: emailPass || "your-app-password",
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
      socketTimeout: 10000,
    };
  }

  transporter = nodemailer.createTransport(transportConfig);
} catch (error) {
  console.warn("Nodemailer is not installed or failed to initialize. Email notifications will be mocked:", error.message);
}

const sendTrackingEmail = async (to, subject, html) => {
  if (!to) return; // Silent return if no email provided

  const emailUser = cleanVal(process.env.EMAIL_USER);
  const emailPass = cleanVal(process.env.EMAIL_PASS);
  const smtpHost = cleanVal(process.env.SMTP_HOST);
  const senderEmail = cleanVal(process.env.SENDER_EMAIL) || (emailUser && emailUser.includes("@") ? emailUser : "noreply@shipnex.com");

  try {
    // In local development, if EMAIL_USER isn't set, we just console log it to avoid crash
    if (!emailUser) {
      console.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
      console.log(`[Mock Email Content]: ${html}`);
      return;
    }

    // Use Brevo HTTP API (HTTPS/443) as Render blocks outbound SMTP ports 25, 465, and 587 by default
    if (smtpHost === "smtp-relay.brevo.com") {
      const apiToken = cleanVal(process.env.BREVO_API_KEY) || emailPass;
      try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": apiToken,
          },
          body: JSON.stringify({
            sender: {
              name: "ShipNex Notifications",
              email: senderEmail,
            },
            to: [{ email: to }],
            subject: subject,
            htmlContent: html,
          }),
        });

        if (response.ok) {
          console.log(`>>> [Mailer] Email sent successfully via Brevo HTTP API to ${to}`);
          return;
        } else {
          const errText = await response.text();
          console.warn(`>>> [Mailer] Brevo HTTP API failed (status ${response.status}). Falling back to SMTP. Details: ${errText}`);
        }
      } catch (fetchErr) {
        console.warn(`>>> [Mailer] Brevo HTTP API request failed. Falling back to SMTP. Error: ${fetchErr.message}`);
      }
    }

    if (!transporter) {
      throw new Error("Transporter not initialized.");
    }

    const mailOptions = {
      from: `"ShipNex Notifications" <${senderEmail}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`>>> [Mailer] Email sent successfully via SMTP to ${to}`);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = {
  sendTrackingEmail,
};
