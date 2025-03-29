import type { FoodItem } from "../types/food-item";
// import "../styles/main_inventory.css"; // Import the new CSS file

interface FoodCardProps {
  item: FoodItem;
}

export default function FoodCard({ item }: FoodCardProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <div className="relative">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-semibold text-white drop-shadow-lg">{item.name}</h3>
        </div>
        <div className="absolute top-2 right-2 bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
          Expires in {item.expiresIn}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="M3 11l19-9-9 19-2-8-8-2z" />
          </svg>
          <span className="text-sm text-gray-600">{item.restaurant}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Quantity available:</p>
            <p className="font-semibold">{item.quantity} portions</p>
          </div>
        </div>

        <button className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors">
          Claim
        </button>
      </div>
    </div>
  );
}
