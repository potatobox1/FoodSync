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
    <div className="filter-sidebar">
      <h2 className="filter-title">Filters</h2>

      <div className="filter-section">
        <label className="filter-label">Minimum Quantity</label>
        <input
          type="number"
          min="0"
          value={minQuantity}
          onChange={(e) => setMinQuantity(Number.parseInt(e.target.value) || 0)}
          className="filter-input"
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
          />
          <span className="filter-checkbox-text">Sort by nearest restaurant</span>
        </label>
        <p className="filter-help-text pl-6">Show food from closest restaurants first</p>
      </div>
    </div>
  )
}

