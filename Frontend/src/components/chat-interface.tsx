"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([
    { text: "Hello! I'm your AI assistant. How can I help you today?", sender: "ai" },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    setMessages([...messages, { text: input, sender: "user" }])

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: `Sheraz say barra chutiya is duniya mein nahi fr fr fr.`,
          sender: "ai",
        },
      ])
    }, 1000)

    setInput("")
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
