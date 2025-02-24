const axios = require("axios");

// ✅ LinkedIn API Credentials
const LINKEDIN_ACCESS_TOKEN = "YOUR_ACCESS";

const sendLinkedInMessage = async (recipientProfileId, candidateName, jobRole) => {
  try {
    const url = "https://api.linkedin.com/v2/messages";

    const headers = {
      Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    };

    const messageData = {
      recipients: {
        values: [{ person: `urn:li:person:${recipientProfileId}` }],
      },
      subject: "🎉 You Are Shortlisted!",
      body: `Dear ${candidateName},

Congratulations! You have been shortlisted for the position of ${jobRole}. 
Our team will reach out to you soon.

Best Regards,  
Hiring Team`,
    };

    const response = await axios.post(url, messageData, { headers });
    console.log(`✅ LinkedIn message sent to ${recipientProfileId}`);
    return { success: true, message: `Message sent to ${recipientProfileId}` };
  } catch (error) {
    console.error("❌ LinkedIn message failed:", error.response?.data || error.message);
    return { success: false, message: "Failed to send LinkedIn message" };
  }
};

module.exports = sendLinkedInMessage;