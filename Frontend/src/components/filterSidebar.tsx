"use client"
import "../styles/mainInventory.css"

interface FilterSidebarProps {
  minQuantity: number
  setMinQuantity: (value: number) => void
  sortByLocation: boolean
  setSortByLocation: (value: boolean) => void
}

export default function FilterSidebar({
  minQuantity,
  setMinQuantity,
  sortByLocation,
  setSortByLocation,
}: FilterSidebarProps) {
  return (
    // It might also be good to add a data-testid to this container div, e.g., data-testid="filter-sidebar"
    <div className="filter-sidebar" data-testid="filter-sidebar"> 
      <h2 className="filter-title">Filters</h2>

      <div className="filter-section">
        <label className="filter-label">Minimum Quantity</label>
        <input
          type="number"
          min="0"
          value={minQuantity}
          onChange={(e) => setMinQuantity(Number.parseInt(e.target.value) || 0)}
          className="filter-input"
          // *** Added data-testid here ***
          data-testid="quantity-input" 
        />
        <p className="filter-help-text">Show items with at least {minQuantity} portions</p>
      </div>

      <div className="mb-4">
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={sortByLocation}
            onChange={() => setSortByLocation(!sortByLocation)}
            className="filter-checkbox"
            // Consider adding a data-testid here too, e.g., data-testid="sort-by-location-checkbox"
            data-testid="sort-by-location-checkbox" 
          />
          <span className="filter-checkbox-text">Sort by nearest restaurant</span>
        </label>
        <p className="filter-help-text pl-6">Show food from closest restaurants first</p>
      </div>
    </div>
  )
}