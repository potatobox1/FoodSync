import React from 'react';
import '../styles/AboutUsPage.css';

const AboutUsPage: React.FC = () => {
  return (
    <div className="about-page">
      <header className="header">
        <a href="/" className="home-link" aria-label="Go to home page">
          <div className="home-icon">🏠</div>
        </a>
        <div className="logo">FoodSync</div>
      </header>

      <main className="about-content">
        <section className="hero-section">
          <h1 className="page-title">About Us</h1>
          <p className="hero-text">
            Every day in Pakistan, thousands of people go to bed hungry — not because there isn't enough food, but because it's not reaching those who need it most.
          </p>
          <p className="hero-text">
            At FoodSync, we believe that no plate should be full while others remain empty. We are a bridge between excess and need — connecting restaurants, caterers, and food businesses with food banks and shelters that serve the most vulnerable in our communities.
          </p>
        </section>

        <section className="why-section">
          <h2 className="section-title">Why We Exist</h2>
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon hunger-icon">🍽️</div>
              <div className="stat-number">36M+</div>
              <div className="stat-description">People in Pakistan face moderate to severe food insecurity (FAO, 2023)</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon waste-icon">🗑️</div>
              <div className="stat-number">40%</div>
              <div className="stat-description">Of food is wasted across the supply chain — from farms and restaurants to households (UNDP Pakistan)</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon child-icon">👶</div>
              <div className="stat-number">1 in 3</div>
              <div className="stat-description">Children under five suffers from stunted growth due to malnutrition</div>
            </div>
          </div>
          <p className="conclusion-text">This is not a shortage issue — it's a distribution problem.</p>
        </section>

        <section className="what-section">
          <h2 className="section-title">What We Do</h2>
          <p className="section-description">
            We make it easier for businesses to make a difference. Through our platform, food providers can list excess prepared or perishable food that would otherwise go to waste. Food banks, shelters, and charities can then request and coordinate pickups quickly and safely.
          </p>
          <div className="features-container">
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <div className="feature-title">Real-time notifications</div>
              <div className="feature-description">Food banks receive alerts when food becomes available nearby</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <div className="feature-title">Safe handling guidelines</div>
              <div className="feature-description">Maintain quality and hygiene throughout the process</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <div className="feature-title">Impact tracking</div>
              <div className="feature-description">Donors can see how their contributions feed people, not landfills</div>
            </div>
          </div>
        </section>

        <section className="vision-section">
          <h2 className="section-title">Our Vision</h2>
          <div className="vision-content">
            <div className="vision-image">
              <div className="vision-icon">🌱</div>
            </div>
            <div className="vision-text">
              <p>To create a Pakistan where no meal goes to waste and no one goes to bed hungry.</p>
              <p>We're not just a tech solution — we're a movement. A movement for sustainability, empathy, and change. One meal, one connection, one act of kindness at a time.</p>
              <p>Join us in rewriting the story of food in Pakistan. Let's turn excess into hope.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">FoodSync</div>
          <div className="footer-tagline">Connecting excess to need</div>
          <div className="footer-copyright">© 2023 FoodSync. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;