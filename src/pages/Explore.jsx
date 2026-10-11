
import { useState } from 'react'
import { Link } from 'react-router-dom'

import destinations from '../data/destinations'

import './Explore.css'

function Explore() {

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const categories = [
    'All',
    'Beaches',
    'Mountains',
    'Heritage',
    'Nature',
    'Cities'
  ]

  const filteredDestinations = destinations.filter(
    destination => {

      const matchesSearch =
        destination.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        destination.state
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesCategory =
        category === 'All' ||
        destination.category === category

      return matchesSearch && matchesCategory
    }
  )

  return (
    <div className="explore-page">

      {/* HERO SECTION */}

      <section className="explore-hero">

        <h1>🌍 Explore Amazing Destinations</h1>

        <p>
          Discover beautiful places and plan your
          next adventure with Travel.
        </p>

        <div className="destination-search">

          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <span>🔍</span>

        </div>

      </section>

      {/* DESTINATIONS SECTION */}

      <section className="destinations-section">

        <h2>Popular Destinations</h2>

        <p>
          Find the perfect destination for your next journey.
        </p>

        {/* CATEGORY FILTER */}

        <div className="destination-filters">

          {categories.map(item => (

            <button
              key={item}
              className={
                category === item
                  ? 'filter-btn active'
                  : 'filter-btn'
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>

          ))}

        </div>

        {/* DESTINATION CARDS */}

        <div className="destination-grid">

          {filteredDestinations.map(destination => (

            <div
              className="destination-card"
              key={destination.id}
            >

              <div className="destination-image">

                <img
                  src={destination.image}
                  alt={destination.name}
                  loading="lazy"
                />

                <span className="destination-category">
                  {destination.category}
                </span>

              </div>

              <div className="destination-content">

                <div className="destination-title">

                  <h3>{destination.name}</h3>

                  <span>
                    ⭐ {destination.rating}
                  </span>

                </div>

                <p className="destination-location">
                  📍 {destination.state}, India
                </p>

                <p className="destination-description">
                  {destination.description}
                </p>

                <div className="destination-details">

                  <span>
                    🕒 {destination.duration}
                  </span>

                  <span>
                    Estimated Budget
                  </span>

                </div>

                <div className="destination-bottom">

                  <div>

                    <small>Starting from*</small>

                    <h2>
                      ₹{destination.budget.toLocaleString('en-IN')}
                    </h2>

                  </div>

                  <Link
                    to="/hotels"
                    className="destination-book-btn"
                  >
                    Explore Stay →
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

        {filteredDestinations.length === 0 && (

          <div className="no-destinations">

            <h3>No destinations found</h3>

            <p>
              Try searching for another city or category.
            </p>

            <button
              onClick={() => {
                setSearch('')
                setCategory('All')
              }}
            >
              Clear Filters
            </button>

          </div>

        )}

        <p className="budget-disclaimer">
          *Budgets and ratings are illustrative demo values.
          Actual travel costs and availability may vary.
        </p>

      </section>

    </div>
  )
}

export default Explore
