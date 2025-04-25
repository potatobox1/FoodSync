import "../styles/mainInventory.css"

export default function Header() {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo-nav-container">
          <a href="/" className="logo">
            FoodSync
          </a>

          <nav className="nav">
         
            <a href="/inventory" className="nav-link-active">
              Available Food
            </a>
            <a href="/OrdersPage" className="nav-link">
              My Orders
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

