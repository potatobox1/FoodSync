import React from 'react';
import styles from '../styles/AboutUsPage.module.css';
import AIAssistant from '../components/ai-assistant'
const AboutUsPage: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
      <header className={styles.header}>
        <a href="/" className={styles.homeLink} aria-label="Go to home page">
          <div className={styles.homeIcon}>🏠</div>
        </a>
        <div className={styles.logo}>FoodSync</div>
      </header>

      <main className={styles.aboutContent}>
        <section className={styles.heroSection}>
          <h1 className={styles.pageTitle}>About Us</h1>
          <p className={styles.heroText}>
            Every day in Pakistan, thousands of people go to bed hungry — not because there isn't enough food, but because it's not reaching those who need it most.
          </p>
          <p className={styles.heroText}>
            At FoodSync, we believe that no plate should be full while others remain empty. We are a bridge between excess and need — connecting restaurants, caterers, and food businesses with food banks and shelters that serve the most vulnerable in our communities.
          </p>
        </section>

        <section className={styles.whySection}>
          <h2 className={styles.sectionTitle}>Why We Exist</h2>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.hungerIcon}`}>🍽️</div>
              <div className={styles.statNumber}>36M+</div>
              <div className={styles.statDescription}>People in Pakistan face moderate to severe food insecurity (FAO, 2023)</div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.wasteIcon}`}>🗑️</div>
              <div className={styles.statNumber}>40%</div>
              <div className={styles.statDescription}>Of food is wasted across the supply chain — from farms and restaurants to households (UNDP Pakistan)</div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.childIcon}`}>👶</div>
              <div className={styles.statNumber}>1 in 3</div>
              <div className={styles.statDescription}>Children under five suffers from stunted growth due to malnutrition</div>
            </div>
          </div>
          <p className={styles.conclusionText}>This is not a shortage issue — it's a distribution problem.</p>
        </section>

        <section className={styles.whatSection}>
          <h2 className={styles.sectionTitle}>What We Do</h2>
          <p className={styles.sectionDescription}>
            We make it easier for businesses to make a difference. Through our platform, food providers can list excess prepared or perishable food that would otherwise go to waste. Food banks, shelters, and charities can then request and coordinate pickups quickly and safely.
          </p>

          <div className={styles.featuresContainer}> 
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔔</div>
              <div className={styles.featureTitle}>Real-time Notifications</div>
              <div className={styles.featureDescription}>
                Food banks are instantly notified when new food items are listed in their area.
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📍</div>
              <div className={styles.featureTitle}>Location-based Pickup Coordination</div>
              <div className={styles.featureDescription}>
                We calculate distances and visualize nearby donors to help food banks plan efficient pickups.
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📈</div>
              <div className={styles.featureTitle}>Donation & Review Insights</div>
              <div className={styles.featureDescription}>
                Both restaurants and food banks can view charts and feedback to track their impact over time.
              </div>
            </div>
          </div> 
        </section>

        <section className={styles.visionSection}>
          <h2 className={styles.sectionTitle}>Our Vision</h2>
          <div className={styles.visionContent}>
            <div className={styles.visionImage}>
              <div className={styles.visionIcon}>🌱</div>
            </div>
            <div className={styles.visionText}>
              <p>To create a Pakistan where no meal goes to waste and no one goes to bed hungry.</p>
              <p>We're not just a tech solution — we're a movement. A movement for sustainability, empathy, and change. One meal, one connection, one act of kindness at a time.</p>
              <p>Join us in rewriting the story of food in Pakistan. Let's turn excess into hope.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>FoodSync</div>
          <div className={styles.footerTagline}>Connecting excess to need</div>
          <div className={styles.footerCopyright}>© 2025 FoodSync. All rights reserved.</div>
        </div>
      </footer>
    
      <AIAssistant/>
    </div>
  );
};

export default AboutUsPage;
