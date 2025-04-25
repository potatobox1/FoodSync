import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const response = await API.post("/api/email/send-email", {
      to,
      subject,
      html,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default API;
