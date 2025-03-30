import "../styles/main_inventory.css"

export default function Header() {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo-nav-container">
          <a href="/" className="logo">
            FoodSync
          </a>

          <nav className="nav">
            <a href="/dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="/" className="nav-link-active">
              Available Food
            </a>
            <a href="/my-orders" className="nav-link">
              My Orders
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

