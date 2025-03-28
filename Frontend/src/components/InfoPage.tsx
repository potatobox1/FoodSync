"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "../styles/InfoPage.css"; // Import the new CSS file
import { signUp } from "../services/sign_up";

// Define types
interface Location {
  id: string
  name: string
}

interface FormData {
  name: string
  email: string
  password: string
  contact_no: string
  user_type: "restaurant" | "food_bank"
  location_id: string
}

interface FormErrors {
  name: string
  email: string
  password: string
  contact_no: string
  location_id: string
}

interface Message {
  text: string
  type: "success" | "error" | ""
}

// Mock locations data (replace with API call in production)
const mockLocations: Location[] = [
  { id: "1", name: "Downtown" },
  { id: "2", name: "Uptown" },
  { id: "3", name: "Midtown" },
  { id: "4", name: "West End" },
  { id: "5", name: "East Side" },
]

const RegisterForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    contact_no: "",
    user_type: "restaurant",
    location_id: "",
  })

  // Error state
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    password: "",
    contact_no: "",
    location_id: "",
  })

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<Message>({ text: "", type: "" })
  const [locations, setLocations] = useState<Location[]>(mockLocations)

  // In a real application, you would fetch locations from your API
  useEffect(() => {
    // Example API call:
    // const fetchLocations = async () => {
    //   try {
    //     const response = await fetch('/api/locations')
    //     const data = await response.json()
    //     setLocations(data)
    //   } catch (error) {
    //     console.error('Failed to fetch locations:', error)
    //   }
    // }
    // fetchLocations()
  }, [])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    let valid = true
    const newErrors = { ...errors }

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
      valid = false
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      valid = false
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      valid = false
    }

    // Validate contact number
    if (!formData.contact_no.trim()) {
      newErrors.contact_no = "Contact number is required"
      valid = false
    } else if (formData.contact_no.trim().length < 10) {
      newErrors.contact_no = "Please enter a valid contact number"
      valid = false
    }

    // Validate location
    if (!formData.location_id) {
      newErrors.location_id = "Please select a location"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage({ text: "", type: "" })

    try {
      const response = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contact_no: formData.contact_no,
        user_type: formData.user_type,
        location_id: formData.location_id
      })

      console.log("Form submitted successfully:", response)
      setMessage({
        text: "Registration successful! Your account has been created.",
        type: "success",
      })

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        password: "",
        contact_no: "",
        user_type: "restaurant",
        location_id: "",
      })

      // Redirect to login page or dashboard
      // window.location.href = '/login';
    } catch (error) {
      console.error("Registration error:", error)
      setMessage({
        text: "Registration failed. Please try again.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Create an account</h1>
          <p>Enter your information to register</p>
        </div>

        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contact_no">Contact Number</label>
            <input
              type="text"
              id="contact_no"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className={errors.contact_no ? "error" : ""}
            />
            {errors.contact_no && <span className="error-message">{errors.contact_no}</span>}
          </div>

          <div className="form-group">
            <label>User Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="user_type"
                  value="restaurant"
                  checked={formData.user_type === "restaurant"}
                  onChange={handleChange}
                />
                Restaurant
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="user_type"
                  value="food_bank"
                  checked={formData.user_type === "food_bank"}
                  onChange={handleChange}
                />
                Food Bank
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location_id">Location</label>
            <select
              id="location_id"
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
              className={errors.location_id ? "error" : ""}
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.location_id && <span className="error-message">{errors.location_id}</span>}
            <small>Select the location where you operate.</small>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm

