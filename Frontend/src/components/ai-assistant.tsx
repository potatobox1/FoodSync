"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X } from "lucide-react"
import ChatInterface from "./chat-interface"
import "../styles/ai-assistant.css"

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [chatPosition, setChatPosition] = useState({ top: "auto", right: "auto", bottom: "80px", left: "auto" })
  const botRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  // Load saved position on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem("aiAssistantPosition")
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition))
      } catch (e) {
        console.error("Failed to parse saved position", e)
      }
    }
  }, [])

  // Handle mouse down for drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (botRef.current) {
      setIsDragging(true)
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })

      // Prevent text selection during drag
      e.preventDefault()
    }
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newX = e.clientX - startPos.x
    const newY = e.clientY - startPos.y

    setPosition({ x: newX, y: newY })
  }

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      // Save position to localStorage
      localStorage.setItem("aiAssistantPosition", JSON.stringify(position))
    }
  }

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, startPos])

  // Calculate chat position based on bot position
  useEffect(() => {
    if (isOpen && botRef.current) {
      const botRect = botRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Default chat dimensions
      const chatWidth = 320
      const chatHeight = 400

      // Calculate if chat would go off-screen
      const wouldGoOffRight = botRect.right + chatWidth > viewportWidth
      const wouldGoOffTop = botRect.top - chatHeight < 0
      const wouldGoOffLeft = botRect.left - chatWidth < 0
      const wouldGoOffBottom = botRect.bottom + chatHeight > viewportHeight

      // Determine optimal position
      const newPosition = {
        top: "auto" as const,
        right: "auto" as const,
        bottom: "auto" as const,
        left: "auto" as const,
      }

      // Horizontal positioning
      if (wouldGoOffRight) {
        // Position to the left of the bot
        newPosition.right = `${viewportWidth - botRect.left}px`
      } else {
        // Position to the right of the bot
        newPosition.left = `${botRect.right}px`
      }

      // Vertical positioning
      if (wouldGoOffBottom) {
        // Position above the bot
        newPosition.bottom = `${viewportHeight - botRect.top}px`
      } else {
        // Position below the bot
        newPosition.top = `${botRect.bottom}px`
      }

      setChatPosition(newPosition)
    }
  }, [isOpen, position])

  const toggleChat = () => {
    if (!isDragging) {
      setIsOpen(!isOpen)
    }
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (botRef.current) {
      setIsDragging(true)
      const touch = e.touches[0]
      setStartPos({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      })
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const newX = touch.clientX - startPos.x
    const newY = touch.clientY - startPos.y

    setPosition({ x: newX, y: newY })
  }

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false)
      localStorage.setItem("aiAssistantPosition", JSON.stringify(position))
    }
  }

  // Add and remove touch event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, startPos])

  return (
    <div className="ai-assistant-container">
      {isOpen && (
        <div
          ref={chatRef}
          className="chat-container"
          style={{
            top: chatPosition.top,
            right: chatPosition.right,
            bottom: chatPosition.bottom,
            left: chatPosition.left,
          }}
        >
          <div className="chat-header">
            <h3>AI Assistant</h3>
            <button onClick={toggleChat} className="close-button">
              <X size={20} />
            </button>
          </div>
          <ChatInterface />
        </div>
      )}

      <div
        ref={botRef}
        className={`ai-bot-icon ${isHovering ? "waving" : ""} ${isDragging ? "dragging" : ""}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => !isDragging && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={toggleChat}
      >
        <div className="robot">
          <div className="antenna"></div>
          <div className="robot-head">
            <div className="robot-face">
              <div className="robot-eyes">
                <div className="eye left">
                  <div className="pupil"></div>
                </div>
                <div className="eye right">
                  <div className="pupil"></div>
                </div>
              </div>
              <div className="robot-mouth">
                <div className="mouth-line"></div>
              </div>
            </div>
          </div>
          <div className="robot-body">
            <div className="robot-arm left"></div>
            <div className="robot-arm right"></div>
          </div>
        </div>
        {isHovering && !isDragging && <div className="greeting-bubble">Hi there! 👋</div>}
        {!isOpen && (
          <div className="icon-badge">
            <MessageSquare size={16} />
          </div>
        )}
      </div>
    </div>
  )
}
