import { Router, Request, Response } from "express"
import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

dotenv.config()

const router = Router()


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

router.post("/", async (req: any, res: any) => {
  const { messages } = req.body as { messages: ChatMessage[] }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request format" })
  }

  try {
   
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: messages.map((message) => message.content).join("\n"),
    })

 
    const reply = response.text
    res.json({ reply })
  } catch (err: any) {
    console.error("Gemini API error:", err.message)
    res.status(500).json({ error: "AI error" })
  }
})

export default router
