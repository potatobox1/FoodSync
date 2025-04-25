import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchAIResponse = async (messages: { role: "user" | "assistant" | "system"; content: string }[]) => {
  try {
    const response = await API.post("/api/chat", { messages });
    const reply = response.data.reply;
    return reply;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw new Error("Something went wrong. Please try again.");
  }
};

export default API;
