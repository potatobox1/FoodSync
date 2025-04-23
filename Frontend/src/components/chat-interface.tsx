"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { fetchAIResponse } from "../services/sendChatbotMessage"
import systemPrompt from "../services/chatbotPrompt"

type Message = {
  text: string
  sender: "user" | "ai"
}

type ChatHistoryMessage = {
  role: "user" | "assistant" | "system"
  content: string
}


export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your AI assistant. How can I help you today?", sender: "ai" },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("chat-history")
    if (saved) {
      setMessages(JSON.parse(saved))
    } else {
      // First time default message
      setMessages([{ text: "Hello! I'm your AI assistant. How can I help you today?", sender: "ai" }])
    }
  }, [])

  // Save messages to localStorage on every update
  useEffect(() => {
    localStorage.setItem("chat-history", JSON.stringify(messages))
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (input.trim() === "") return

    const userMessage = { text: input, sender: "user" as const }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")

    const chatHistory: ChatHistoryMessage[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...updatedMessages.map((msg): ChatHistoryMessage => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
    ]

    try {
      const reply = await fetchAIResponse(chatHistory);  // Call the function
      setMessages((prev) => [...prev, { text: reply, sender: "ai" }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Please try again.", sender: "ai" },
      ]);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          rows={1}
        />
        <button onClick={handleSend} disabled={input.trim() === ""}>
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
