const nodemailer = require("nodemailer");

// ✅ Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kandiahc2006@gmail.com",
    pass: "kxdu zoai zbfm gzkx",
  },
});

// ✅ Function to Send Email
const sendEmail = async (recipientEmail, candidateName, jobRole) => {
  try {
    // console.log(jobRole);
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: recipientEmail,
      subject: "🎉 You Are Shortlisted for the Job Role!",
      text: `Dear ${candidateName},

      Congratulations! You have been shortlisted for the position of ${jobRole}. 
      Our team schdule an interview on 25th Feburaray at 9.00 AM.
      
      join the meeting by clicking the link below:
      https://meet.google.com/iqs-ueic-hwa

      Best Regards,  
      Hiring Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${recipientEmail}`);
    return { success: true, message: `Email sent to ${recipientEmail}` };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return { success: false, message: "Failed to send email" };
  }
};

module.exports = sendEmail;