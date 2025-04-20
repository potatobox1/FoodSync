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
  const [chatPosition, setChatPosition] = useState<{
    top: string | number
    right: string | number
    bottom: string | number
    left: string | number
  }>({ top: "auto", right: "auto", bottom: "80px", left: "auto" })
  const botRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  // Load saved position or default to bottom-right
  useEffect(() => {
    const savedPosition = localStorage.getItem("aiAssistantPosition")
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition))
      } catch (e) {
        console.error("Failed to parse saved position", e)
      }
    } else {
      // Set default position to bottom-right
      const defaultWidth = 100
      const defaultHeight = 100
      const x = window.innerWidth - defaultWidth - 20
      const y = window.innerHeight - defaultHeight - 20
      setPosition({ x, y })
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
      localStorage.setItem("aiAssistantPosition", JSON.stringify(position))
    }
  }

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

      const chatWidth = 320
      const chatHeight = 400

      const wouldGoOffRight = botRect.right + chatWidth > viewportWidth
      const wouldGoOffTop = botRect.top - chatHeight < 0
      const wouldGoOffLeft = botRect.left - chatWidth < 0
      const wouldGoOffBottom = botRect.bottom + chatHeight > viewportHeight

      const newPosition = {
        top: "auto" as string,
        right: "auto" as string,
        bottom: "auto" as string,
        left: "auto" as string,
      }

      if (wouldGoOffRight) {
        newPosition.right = `${viewportWidth - botRect.left}px`
      } else {
        newPosition.left = `${botRect.right}px`
      }

      if (wouldGoOffBottom) {
        newPosition.bottom = `${viewportHeight - botRect.top}px`
      } else {
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
