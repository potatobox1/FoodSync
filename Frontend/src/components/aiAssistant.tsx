"use client"

import React, { useState, useRef, useEffect } from "react"
import { MessageSquare, X } from "lucide-react"
import ChatInterface from "./chatInterface"
import "../styles/aiAssistant.css"

const BOT_SIZE = 70
const PADDING = 10

function getInitialPosition(): { x: number; y: number } {
  if (typeof window === "undefined") return { x: 0, y: 0 }
  try {
    const saved = JSON.parse(localStorage.getItem("aiAssistantPosition") || "null")
    if (saved && typeof saved.x === "number" && typeof saved.y === "number") {
      const x = Math.min(Math.max(saved.x, 0), window.innerWidth - BOT_SIZE)
      const y = Math.min(Math.max(saved.y, 0), window.innerHeight - BOT_SIZE)
      return { x, y }
    }
  } catch {}
  return { x: window.innerWidth - BOT_SIZE - PADDING, y: window.innerHeight - BOT_SIZE - PADDING }
}

export default function AIAssistant() {
  const [position, setPosition] = useState<{ x: number; y: number }>(getInitialPosition)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [chatPosition, setChatPosition] = useState<{ top: string | number; right: string | number; bottom: string | number; left: string | number }>(
    { top: "auto", right: "auto", bottom: "80px", left: "auto" }
  )

  const botRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!botRef.current) return
    setIsDragging(true)
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y })
    e.preventDefault()
  }
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y })
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
  }, [isDragging, startPos, position])

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!botRef.current) return
    setIsDragging(true)
    const t = e.touches[0]
    setStartPos({ x: t.clientX - position.x, y: t.clientY - position.y })
  }
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    const t = e.touches[0]
    setPosition({ x: t.clientX - startPos.x, y: t.clientY - startPos.y })
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
  }, [isDragging, startPos, position])

  // Toggle chat bubble
  const toggleChat = () => { if (!isDragging) setIsOpen(!isOpen) }
  useEffect(() => {
    if (!isOpen || !botRef.current) return
    const rect = botRef.current.getBoundingClientRect()
    const vw = window.innerWidth, vh = window.innerHeight
    const w = 320, h = 400
    const pos: any = { top: "auto", right: "auto", bottom: "auto", left: "auto" }
    pos.left = rect.right + w <= vw ? `${rect.right}px` : undefined
    pos.right = rect.right + w > vw ? `${vw - rect.left}px` : undefined
    pos.top = rect.bottom + h <= vh ? `${rect.bottom}px` : undefined
    pos.bottom = rect.bottom + h > vh ? `${vh - rect.top}px` : undefined
    setChatPosition(pos)
  }, [isOpen, position])

  // Eye follow
  useEffect(() => {
    const maxOffset = 2
    const follow = (e: MouseEvent) => {
      document.querySelectorAll<HTMLDivElement>(".pupil").forEach((p) => {
        const eye = p.parentElement!, r = eye.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height/2)
        const d = Math.hypot(dx, dy) || 1
        p.style.transform = `translate(${(dx/d)*maxOffset}px, ${(dy/d)*maxOffset}px)`
      })
    }
    window.addEventListener("mousemove", follow)
    return () => window.removeEventListener("mousemove", follow)
  }, [])

  return (
    <div className="ai-assistant-container">
      {/* Chat window */}
      {isOpen && (
        <div ref={chatRef} className="chat-container" style={{
            top: chatPosition.top,
            right: chatPosition.right,
            bottom: chatPosition.bottom,
            left: chatPosition.left
          }}>
          <div className="chat-header">
            <h3>AI Assistant</h3>
            <button onClick={toggleChat} className="close-button"><X size={20}/></button>
          </div>
          <ChatInterface />
        </div>
      )}

      {/* Bot icon */}
      <div
        ref={botRef}
        className={`ai-bot-icon ${isHovering ? "waving" : ""} ${isDragging ? "dragging" : ""}`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)`, cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => !isDragging && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={toggleChat}
      >
        {/* Robot graphic unchanged */}
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
        {!isOpen && <div className="icon-badge"><MessageSquare size={16}/></div>}
      </div>
    </div>
  )
}
