import "../styles/leaderboard.css"

function App() {
  return (
    <div className="app">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="container">
          <div className="logo">
            <span className="logo-food">Food</span>
            <span className="logo-sync">Sync</span>
          </div>
          <nav className="nav-menu">
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Dashboard</a>
              </li>
              <li>
                <a href="#">Inventory</a>
              </li>
              <li>
                <a href="#">Orders</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <h1 className="page-title">Leaderboard</h1>

        {/* Top 3 Leaders */}
        <div className="top-leaders">
          {/* PC-Lahore */}
          <div className="leader-card">
            <div className="leader-image gold-border">
              <img src="https://via.placeholder.com/160" alt="PC-Lahore" />
            </div>
            <div className="leader-info gold">
              <h3>PC-Lahore</h3>
              <p>2055 Points</p>
            </div>
          </div>

          {/* DHA Club J */}
          <div className="leader-card">
            <div className="leader-image silver-border">
              <img src="https://via.placeholder.com/160" alt="DHA Club J" />
            </div>
            <div className="leader-info silver">
              <h3>DHA Club J</h3>
              <p>2006 Points</p>
            </div>
          </div>

          {/* KFC Phase 6 */}
          <div className="leader-card">
            <div className="leader-image bronze-border">
              <img src="https://via.placeholder.com/160" alt="KFC Phase 6" />
            </div>
            <div className="leader-info bronze">
              <h3>KFC Phase 6</h3>
              <p>1098 Points</p>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="leaderboard-list">
          {/* DHA Club Isl */}
          <div className="list-item light-blue">
            <span className="rank">3</span>
            <div className="user-image">
              <img src="https://via.placeholder.com/64" alt="DHA Club Isl" />
            </div>
            <span className="user-name">DHA Club Isl</span>
            <span className="points">1098 Points</span>
          </div>

          {/* You */}
          <div className="list-item teal">
            <span className="rank">4</span>
            <div className="user-image">
              <img src="https://via.placeholder.com/64" alt="You" />
            </div>
            <span className="user-name">You</span>
            <span className="points">1098 Points</span>
          </div>

          {/* Cheezious */}
          <div className="list-item light-blue">
            <span className="rank">5</span>
            <div className="user-image">
              <img src="https://via.placeholder.com/64" alt="Cheezious" />
            </div>
            <span className="user-name">Cheezious</span>
            <span className="points">1098 Points</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

