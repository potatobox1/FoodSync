"use client"
// import "../styles/main_inventory.css"; // Import the new CSS file
interface CategoryFilterProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  const categories = ["All Items", "Beverage", "Savoury", "Sweet"]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            selectedCategory === category ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

