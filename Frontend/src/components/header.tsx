import { Link } from "react-router-dom";
// import "../styles/main_inventory.css"; // Import the new CSS file

export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-teal-600 text-xl font-bold">
            FoodSync
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-teal-600">
              Dashboard
            </Link>
            <Link to="/" className="text-teal-600 font-medium">
              Available Food
            </Link>
            <Link to="/my-orders" className="text-gray-600 hover:text-teal-600">
              My Orders
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
