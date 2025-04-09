import type React from "react"
import { Package } from "lucide-react"
import styles from "../styles/LandingPage.module.css"

const LandingPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>
            Food<span className={styles.logoHighlight}>Sync</span>
          </span>
        </div>
        <div className={styles.headerButtons}>
          {/* <a href="/contact" className={styles.contactLink}>
            Contact Us
          </a> */}
          <a href="/login" className={styles.joinButton}>
            Join
          </a>
          <a href="/login" className={styles.loginButton}>
            Login
          </a>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Join the Fight Against Food Waste Today!</h1>
          <p className={styles.heroText}>
            Our innovative web application connects restaurants and food banks, ensuring that surplus food reaches those
            in need. Together, we can make a significant impact on reducing food wastage and feeding our communities.
          </p>
          <a href="/AboutUs" className={styles.learnMoreButton}>
            Learn More
          </a>
        </div>
      </section>

      <section className={styles.getStarted}>
        <div className={styles.getStartedContent}>
          <div className={styles.getStartedLeft}>
            <h2 className={styles.getStartedTitle}>Get Started with Our Food Rescue Platform</h2>
          </div>
          <div className={styles.getStartedRight}>
            <p className={styles.getStartedText}>
              Join our platform to help reduce food waste. It's simple: sign up, list your available inventory, and
              connect with local foodbanks. Together, we can make a difference in our community.
            </p>
          </div>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepIconContainer}>
              <Package className={styles.stepIcon} />
            </div>
            <h3 className={styles.stepTitle}>Step 1: Sign Up for an Account</h3>
            <p className={styles.stepText}>Create your account in just a few clicks.</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepIconContainer}>
              <Package className={styles.stepIcon} />
            </div>
            <h3 className={styles.stepTitle}>Step 2: List Your Available Inventory</h3>
            <p className={styles.stepText}>Easily upload your surplus food items.</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepIconContainer}>
              <Package className={styles.stepIcon} />
            </div>
            <h3 className={styles.stepTitle}>Step 3: Connect with Local Foodbanks</h3>
            <p className={styles.stepText}>Coordinate pickups and help those in need.</p>
          </div>
        </div>

        <div className={styles.signUpButtonContainer}>
          <a href="/login" className={styles.signUpButton}>
            Sign Up
          </a>
        </div>
      </section>
      <section className={styles.restaurantsSection}>
  <h2 className={styles.sectionTitle}>Restaurants on our platform</h2>
  <div className={styles.restaurantsGrid}>
    <div className={styles.restaurantCard}>
      <img src="../../images/club_j.jpg" alt="Defence Club J" className={styles.restaurantImage} />
      <h3>Defence club J</h3>
      <p>One of the leading food donors of Lahore, known for its food quality and taste</p>
    </div>
    <div className={styles.restaurantCard}>
      <img src="../../images/raya.png" alt="Defence Club Raya" className={styles.restaurantImage} />
      <h3>Defence Club Raya</h3>
      <p>Main stay on any foodies wishlist, known for amazing food and great variety</p>
    </div>
    <div className={styles.restaurantCard}>
      <img src="../../images/club_f.webp" alt="Defence Club FF" className={styles.restaurantImage} />
      <h3>Defence Club FF</h3>
      <p>Known for its desi cuisine, FF is one of the largest donors of desi food in Lahore.</p>
    </div>
  </div>
</section>

<section className={styles.goalsSection}>
  <h2 className={styles.sectionTitle}>Our Goals</h2>
  <div className={styles.goalsGrid}>
    <div className={styles.goalCard}>
      <h3>Reduce food Waste</h3>
      <p>Minimizing surplus food waste by connecting restaurants with food banks in real-time, ensuring that excess food reaches those who need it most.</p>
    </div>
    <div className={styles.goalCard}>
      <h3>From Surplus to Support</h3>
      <p>Bridging the gap between restaurants and underfunded food banks to ensure surplus food reaches those in need.</p>
    </div>
    <div className={styles.goalCard}>
      <h3>Community Collaboration</h3>
      <p>Encouraging restaurants and food banks to work together, share resources, and create a sustainable impact on food security.</p>
    </div>
  </div>
</section>

<footer className={styles.footer}>
  <div className={styles.footerGrid}>
    <div className={styles.footerItem}>
      <img src="../../email.svg" alt="Email" className={styles.footerIcon} />
      <h3>Email</h3>
      <p>Stunting in children can have long<br />term effect on their growth and development</p>
      <a href="mailto:cegastuntinginqlm@gmail.com">cegastuntinginqlm@gmail.com</a>
    </div>

    <div className={styles.footerItem}>
      <img src="../../phone.svg" alt="Phone" className={styles.footerIcon} />
      <h3>Phone</h3>
      <p>Stunting in children can have long<br />term effect on their growth and development</p>
      <a href="tel:+923211105090">+92 321 110 50 90</a>
    </div>

    <div className={styles.footerItem}>
      <img src="../../location.svg" alt="Office" className={styles.footerIcon} />
      <h3>Office</h3>
      <p>Stunting in children can have long<br />term effect on their growth and development</p>
      <a href="https://www.google.com/maps?q=Punjab+Small+Industries+Housing" target="_blank" rel="noopener noreferrer">
        Punjab Small Industries Housing
      </a>
    </div>
  </div>
</footer>


    </div>
  )
}

export default LandingPage
