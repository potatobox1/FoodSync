"use client"
import "../styles/mainInventory.css"

interface CategoryFilterProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  const categories = ["All Items", "Beverage", "Savoury", "Sweet"]

  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category}
          data-testid={`category-button-${category.toLowerCase()}`}
          onClick={() => setSelectedCategory(category)}
          className={selectedCategory === category ? "category-button category-button-active" : "category-button"}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

