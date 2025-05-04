import React, { useState } from "react";
import "../styles/AddItemModal.css";
import { addFoodItem } from "../services/foodItems";
import { useAppSelector } from "../redux/hooks";


interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: () => void; 
}

export default function AddItemModal({ isOpen, onClose, onItemAdded }: AddItemModalProps) {
  const rest_id = useAppSelector((state: any) => state.user.type_id);
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const isValidDate = (dateString: string) => {
    return !isNaN(Date.parse(dateString));
  };

  const isValidNumber = (value: string) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      quantity:
        formData.quantity.trim() === ""
          ? "Quantity is required"
          : !isValidNumber(formData.quantity)
          ? "Quantity must be a valid number"
          : "",
      expiration:
        formData.expiration.trim() === ""
          ? "Expiration is required"
          : !isValidDate(formData.expiration)
          ? "Enter a valid date"
          : "",
      name: formData.name.trim() ? "" : "Name is required",
      category: formData.category.trim() ? "" : "Please select a category",
    };

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    setErrors(newErrors);

    if (hasErrors) return;
    setIsSubmitting(true);
    try {
      const restaurant_id =  rest_id 

      const formattedDate = new Date(formData.expiration).toISOString(); 

      const payload = {
        restaurant_id,
        name: formData.name,
        quantity: Number(formData.quantity),
        expiration_date: formattedDate,
        category: formData.category,
      };

      console.log("Submitting food item:", payload);

      await addFoodItem(payload);


      onItemAdded();

      
      setFormData({
        quantity: "",
        expiration: "",
        name: "",
        category: "",
      });

      onClose();
    } catch (error) {
      console.error("Failed to add food item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // In your AddItemModal component, modify the elements to include data-testid attributes:

return (
  <div className="modal-overlay" data-testid="add-item-modal">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Add an Item</h2>
        <button 
          onClick={onClose} 
          className="modal-close"
          data-testid="close-modal-button"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            data-testid="quantity-input"
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            className={errors.quantity ? "error" : ""}
          />
          {errors.quantity && (
            <span data-testid="quantity-error" className="error-message">
              {errors.quantity}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="expiration">Expiration</label>
          <input
            data-testid="expiration-input"
            id="expiration"
            name="expiration"
            type="date"
            value={formData.expiration}
            onChange={handleChange}
            className={errors.expiration ? "error" : ""}
          />
          {errors.expiration && (
            <span data-testid="expiration-error" className="error-message">
              {errors.expiration}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            data-testid="name-input"
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && (
            <span data-testid="name-error" className="error-message">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            data-testid="category-select"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? "error" : ""}
          >
            <option value="">-- Select Category --</option>
            <option value="Beverage">Beverage</option>
            <option value="Sweet">Sweet</option>
            <option value="Savoury">Savoury</option>
          </select>
          {errors.category && (
            <span data-testid="category-error" className="error-message">
              {errors.category}
            </span>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button 
            type="submit" 
            className="confirm-btn"
            data-testid="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Confirm'}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}
