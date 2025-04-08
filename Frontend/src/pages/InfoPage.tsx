// "use client"

import type React from "react"
import { useState } from "react"
import "../styles/InfoPage.css"
import { signUp,registerFoodBank,registerRestaurant } from "../services/sign_up"
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

interface FormData {
  name: string
  email: string
  contact_no: string
  user_type: "restaurant" | "food_bank"
  address: string
  city: string
  country: string
  cuisine_type?: string;
}


interface FormErrors {
  name: string
  email: string
  contact_no: string
  address: string
  city: string
  country: string
  latitude: string
  longitude: string
}

const cuisineOptions = [
  "Italian",
  "Chinese",
  "Indian",
  "Pakistani",
  "Mexican",
  "American",
  "French",
  "Japanese",
  "Mediterranean",
  "Other",
];

interface Message {
  text: string
  type: "success" | "error" | ""
}

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();

  const location = useLocation();
  const uid = location.state?.uid || null;
  console.log("Inside Info-Page: ",uid)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    contact_no: "",
    user_type: "restaurant",
    address: "",
    city: "",
    country: "",
  })

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    contact_no: "",
    address: "",
    city: "",
    country: "",
    latitude: "",
    longitude: ""
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<Message>({ text: "", type: "" })
  const [latitude, setLatitude] = useState<string>("")
  const [longitude, setLongitude] = useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = (): boolean => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
      valid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      valid = false
    }

    if (!formData.contact_no.trim()) {
      newErrors.contact_no = "Contact number is required"
      valid = false
    } else if (formData.contact_no.trim().length < 10) {
      newErrors.contact_no = "Please enter a valid contact number"
      valid = false
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
      valid = false
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
      valid = false
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
      valid = false
    }

    if (!latitude) {
      newErrors.latitude = "Latitude is required"
      valid = false
    }

    if (!longitude) {
      newErrors.longitude = "Longitude is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage({ text: "", type: "" })

    try {
      const response = await signUp({
        uid,
        name: formData.name,
        email: formData.email,
        contact_no: formData.contact_no,
        user_type: formData.user_type,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      })
      console.log("User Registered:", response);
      

      if (formData.user_type === "restaurant") {
        if (!formData.cuisine_type) {
          throw new Error("Cuisine type is required for restaurants.");
        }
          const ret_api = await registerRestaurant({
          uid,
          cuisine_type: formData.cuisine_type,
        });
        dispatch(setUser({
          uid,
          id:ret_api.restaurant.id,
        }));
        console.log("Restaurant Registered",ret_api.restaurant.id);
      } else {
        let ret_api = await registerFoodBank({
          uid,
          transportation_notes: "", // Add input field for this if needed
        });
        console.log("Food Bank Registered");
        dispatch(setUser({
          uid,
          id:ret_api.foodbank.id,
        }));
      }
      console.log("Form submitted successfully:", response)
      setMessage({
        text: "Registration successful! Your account has been created.",
        type: "success",
      })

      setFormData({
        name: "",
        email: "",
        contact_no: "",
        user_type: "restaurant",
        address: "",
        city: "",
        country: "",
      })

      setLatitude("")
      setLongitude("")

      window.location.href = "/dashboard"
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

          {formData.user_type === "restaurant" && (
            <div className="form-group">
              <label htmlFor="cuisine_type">Cuisine Type</label>
              <select
                id="cuisine_type"
                name="cuisine_type"
                value={formData.cuisine_type}
                onChange={handleChange}
              >
                <option value="">Select Cuisine Type</option>
                {cuisineOptions.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className={errors.address ? "error" : ""}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className={errors.city ? "error" : ""}
            />
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter your country"
              className={errors.country ? "error" : ""}
            />
            {errors.country && <span className="error-message">{errors.country}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="text"
                value={latitude}
                readOnly
                placeholder="Latitude"
                className={errors.latitude ? "error" : ""}
              />
              {errors.latitude && <span className="error-message">{errors.latitude}</span>}
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input
                type="text"
                value={longitude}
                readOnly
                placeholder="Longitude"
                className={errors.longitude ? "error" : ""}
              />
              {errors.longitude && <span className="error-message">{errors.longitude}</span>}
            </div>
          </div>

          <button
            type="button"
            className="submit-button"
            onClick={() => {
              if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setLatitude(position.coords.latitude.toString())
                    setLongitude(position.coords.longitude.toString())

                    // Clear previous errors
                    setErrors((prev) => ({
                      ...prev,
                      latitude: "",
                      longitude: ""
                    }))
                  },
                  (error) => {
                    console.error("Error getting location:", error)
                    alert("Failed to get your location. Please allow location access.")
                  }
                )
              } else {
                alert("Geolocation is not supported by your browser.")
              }
            }}
          >
            Get Location
          </button>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm
