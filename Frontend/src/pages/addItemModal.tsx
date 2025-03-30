import React, { useState } from "react";
import "../styles/AddItemModal.css"; // Ensure path is correct

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    quantity: "",
    expiration: "",
    name: "",
    category: "",
  });

  const [errors, setErrors] = useState({
    quantity: "",
    expiration: "",
    name: "",
    category: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on input
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      quantity: formData.quantity.trim() ? "" : "Quantity is required",
      expiration: formData.expiration.trim() ? "" : "Expiration is required",
      name: formData.name.trim() ? "" : "Name is required",
      category: formData.category.trim() ? "" : "Category is required",
    };

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    setErrors(newErrors);

    if (hasErrors) return;

    console.log("Form submitted:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add an Item</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {["quantity", "expiration", "name", "category"].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type="text"
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className={errors[field as keyof typeof errors] ? "error" : ""}
              />
              {errors[field as keyof typeof errors] && (
                <span className="error-message">
                  {errors[field as keyof typeof errors]}
                </span>
              )}
            </div>
          ))}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="confirm-btn">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
