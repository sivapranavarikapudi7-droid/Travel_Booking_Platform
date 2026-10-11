
import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tagline">
            YOUR JOURNEY STARTS HERE
          </p>

          <h1>
            Explore The World With
            <span> Travel</span>
          </h1>

          <p>
            Discover amazing destinations, book flights,
            find hotels and plan your perfect journey.
          </p>

          <Link to="/explore" className="explore-btn">
            Explore Now →
          </Link>
        </div>
      </section>

      {/* Travel Services */}
      <section className="services">
        <h2>Our Travel Services</h2>

        <p>
          Everything you need for your perfect trip
        </p>

        <div className="service-container">
          {/* Flights */}
          <div className="service-card" id="flights">
            <div className="service-icon">✈️</div>

            <h3>Flights</h3>

            <p>
              Search and book flights to your favourite
              destinations with ease.
            </p>

            <Link to="/flights" className="service-link">
              Book Flights →
            </Link>
          </div>

          {/* Hotels */}
          <div className="service-card" id="hotels">
            <div className="service-icon">🏨</div>

            <h3>Hotels</h3>

            <p>
              Discover comfortable stays for your next
              trip and adventure.
            </p>

            <Link to="/hotels" className="service-link">
              Book Hotels →
            </Link>
          </div>

          {/* Cabs */}
          <div className="service-card" id="cabs">
            <div className="service-icon">🚕</div>

            <h3>Cabs</h3>

            <p>
              Find convenient transportation options
              for your journey.
            </p>

            <Link to="/cabs" className="service-link">
              Book Cabs →
            </Link>
          </div>

          {/* Explore */}
          <div className="service-card" id="explore">
            <div className="service-icon">🌍</div>

            <h3>Explore</h3>

            <p>
              Discover beautiful places and find
              inspiration for your next trip.
            </p>

            <Link to="/explore" className="service-link">
              Explore Places →
            </Link>
          </div>
        </div>
      </section>

      {/* Travel Benefits */}
      <section className="travel-benefits">
        <div className="benefit-item">
          <span>✈️</span>

          <h3>Easy Trip Planning</h3>

          <p>
            Explore flights, hotels and transport
            in one place.
          </p>
        </div>

        <div className="benefit-item">
          <span>🌍</span>

          <h3>Discover Places</h3>

          <p>
            Find destinations and plan your next
            adventure.
          </p>
        </div>

        <div className="benefit-item">
          <span>📋</span>

          <h3>Manage Your Trips</h3>

          <p>
            Keep track of your saved demo bookings.
          </p>

          <Link to="/my-trips" className="benefit-link">
            View My Trips →
          </Link>
        </div>
      </section>

      {/* Demo Booking Notice */}
      <section className="demo-notice">
        <strong>Demo Project Notice</strong>

        <p>
          This website is for demonstration purposes only.
          Bookings are demonstrations and do not create real
          reservations or process real payments.
        </p>
      </section>
    </>
  )
}

export default Home
