"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageSquare, X } from "lucide-react"
import ChatInterface from "./chatInterface"
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

  // Load saved position or default to bottom-right based on actual size
  useEffect(() => {
    const savedPosition = localStorage.getItem("aiAssistantPosition")
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition))
        return
      } catch (e) {
        console.error("Failed to parse saved position", e)
      }
    }

    // Wait for bot to render before calculating its size
    const handleDefaultPosition = () => {
        if (botRef.current) {
            const rect = botRef.current.getBoundingClientRect()
            
            // 👇 Change this padding value as needed
            const paddingRight = 10
            const paddingBottom = 10
        
            const x = window.innerWidth - rect.width - paddingRight
            const y = window.innerHeight - rect.height - paddingBottom
        
            setPosition({ x, y })
          }
    }

    // Slight delay to ensure DOM is ready
    setTimeout(handleDefaultPosition, 50)
  }, [])

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

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const newX = e.clientX - startPos.x
    const newY = e.clientY - startPos.y
    setPosition({ x: newX, y: newY })
  }

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

  useEffect(() => {
    const maxOffset = 2; // how far the pupil can move inside the eye

    function handlePupilFollow(e: MouseEvent) {
      document.querySelectorAll<HTMLDivElement>('.pupil').forEach(pupil => {
        const eye = pupil.parentElement!;  // the .eye
        const rect = eye.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.hypot(dx, dy) || 1;
        const offsetX = (dx / dist) * maxOffset;
        const offsetY = (dy / dist) * maxOffset;

        // apply inline transform
        pupil.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      })
    }

    window.addEventListener('mousemove', handlePupilFollow);
    return () => {
      window.removeEventListener('mousemove', handlePupilFollow);
    }
  }, []);

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
        {isHovering && !isDragging && <div className="greeting-bubble">Hi there! Iam Foodie 👋</div>}
        {!isOpen && (
          <div className="icon-badge">
            <MessageSquare size={16} />
          </div>
        )}
      </div>
    </div>
  )
}
