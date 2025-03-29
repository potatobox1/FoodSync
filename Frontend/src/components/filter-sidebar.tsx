// "use client"
// import "../styles/main_inventory.css"; // Import the new CSS file
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
    <div className="w-full md:w-64 bg-gray-50 p-4 rounded-lg">
      <h2 className="font-semibold text-lg mb-4">Filters</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Quantity</label>
        <input
          type="number"
          min="0"
          value={minQuantity}
          onChange={(e) => setMinQuantity(Number.parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <p className="mt-1 text-sm text-gray-500">Show items with at least {minQuantity} portions</p>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sortByLocation}
            onChange={() => setSortByLocation(!sortByLocation)}
            className="rounded text-teal-600 focus:ring-teal-500"
          />
          <span className="text-sm font-medium text-gray-700">Sort by nearest location</span>
        </label>
        <p className="mt-1 text-sm text-gray-500 pl-6">Show closest items first</p>
      </div>
    </div>
  )
}

