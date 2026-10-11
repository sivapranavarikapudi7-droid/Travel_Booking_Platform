
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useBookings } from '../context/BookingContext'

import './Flights.css'

// Demonstration flight data
const flightsData = [
  {
    id: 1,
    airline: 'IndiGo',
    from: 'Hyderabad',
    to: 'Delhi',
    departure: '06:00 AM',
    arrival: '08:15 AM',
    duration: '2h 15m',
    price: 4500
  },
  {
    id: 2,
    airline: 'Air India',
    from: 'Hyderabad',
    to: 'Delhi',
    departure: '10:30 AM',
    arrival: '12:45 PM',
    duration: '2h 15m',
    price: 5200
  },
  {
    id: 3,
    airline: 'IndiGo',
    from: 'Hyderabad',
    to: 'Mumbai',
    departure: '07:00 AM',
    arrival: '08:30 AM',
    duration: '1h 30m',
    price: 3800
  },
  {
    id: 4,
    airline: 'Air India',
    from: 'Vijayawada',
    to: 'Bangalore',
    departure: '09:00 AM',
    arrival: '10:30 AM',
    duration: '1h 30m',
    price: 4200
  },
  {
    id: 5,
    airline: 'IndiGo',
    from: 'Chennai',
    to: 'Hyderabad',
    departure: '04:00 PM',
    arrival: '05:20 PM',
    duration: '1h 20m',
    price: 3500
  }
]

function Flights() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addBooking } = useBookings()

  // Search form
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState(1)

  // Search results
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [bookingInProgress, setBookingInProgress] = useState(false)

  // Minimum travel date
  const today = new Date()

  const minDate =
    today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0')

  // Search flights
  const searchFlights = (e) => {
    e.preventDefault()

    if (from === to) {
      alert('Departure and destination cannot be the same!')
      return
    }

    if (date < minDate) {
      alert('Please select a valid travel date.')
      return
    }

    const filtered = flightsData.filter(
      flight =>
        flight.from === from &&
        flight.to === to
    )

    setResults(filtered)
    setSearched(true)
  }

  // Save booking to MongoDB
  const bookFlight = async (flight) => {
    if (!user) {
      alert('Please log in before booking a flight.')
      navigate('/login')
      return
    }

    if (bookingInProgress) {
      return
    }

    setBookingInProgress(true)

    try {
      const total = flight.price * passengers

      const success = await addBooking({
        type: 'Flight',
        title: flight.airline,
        from: flight.from,
        to: flight.to,
        date: date,
        passengers: passengers,
        departure: flight.departure,
        arrival: flight.arrival,
        total: total
      })

      if (!success) {
        alert('Booking could not be saved. Please try again.')
        return
      }

      alert(
        `Flight booking saved successfully!\n\n` +
        `Airline: ${flight.airline}\n` +
        `Route: ${flight.from} → ${flight.to}\n` +
        `Date: ${date}\n` +
        `Passengers: ${passengers}\n` +
        `Total: ₹${total.toLocaleString('en-IN')}`
      )

      navigate('/my-trips')
    } finally {
      setBookingInProgress(false)
    }
  }

  return (
    <div className="flights-page">

      {/* HERO SECTION */}
      <section className="flights-hero">
        <h1>✈️ Find Your Perfect Flight</h1>

        <p>
          Search and explore affordable flights
          for your next journey.
        </p>
      </section>

      {/* FLIGHT SEARCH */}
      <section className="flight-search-box">
        <h2>Search Flights</h2>

        <form onSubmit={searchFlights}>
          <div className="flight-form-grid">

            <div className="flight-input">
              <label>From</label>

              <select
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value)
                  setSearched(false)
                }}
                required
              >
                <option value="">Select Departure</option>
                <option>Hyderabad</option>
                <option>Vijayawada</option>
                <option>Chennai</option>
                <option>Delhi</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
              </select>
            </div>

            <div className="flight-input">
              <label>To</label>

              <select
                value={to}
                onChange={(e) => {
                  setTo(e.target.value)
                  setSearched(false)
                }}
                required
              >
                <option value="">Select Destination</option>
                <option>Hyderabad</option>
                <option>Vijayawada</option>
                <option>Chennai</option>
                <option>Delhi</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
              </select>
            </div>

            <div className="flight-input">
              <label>Travel Date</label>

              <input
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  setSearched(false)
                }}
                required
              />
            </div>

            <div className="flight-input">
              <label>Passengers</label>

              <select
                value={passengers}
                onChange={(e) => {
                  setPassengers(Number(e.target.value))
                  setSearched(false)
                }}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} Passenger{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="flight-search-btn"
          >
            Search Flights
          </button>
        </form>
      </section>

      {/* FLIGHT RESULTS */}
      {searched && (
        <section className="flight-results">
          <h2>Available Flights</h2>

          <p className="flight-route-info">
            {from} → {to} | {date} | {passengers}
            {' '}Passenger{passengers > 1 ? 's' : ''}
          </p>

          {/* NO RESULTS */}
          {results.length === 0 && (
            <div className="flight-no-results">
              <h3>No Flights Found</h3>

              <p>
                No demonstration flights are currently
                available for this route.
              </p>

              <p>
                Try Hyderabad to Delhi or
                Hyderabad to Mumbai.
              </p>
            </div>
          )}

          {/* AVAILABLE FLIGHTS */}
          <div className="flight-list">
            {results.map(flight => (
              <div
                className="flight-card"
                key={flight.id}
              >

                <div className="flight-airline">
                  <h3>✈️ {flight.airline}</h3>
                  <small>Non-stop Flight</small>
                </div>

                <div className="flight-timing">
                  <div>
                    <h3>{flight.departure}</h3>
                    <p>{flight.from}</p>
                  </div>

                  <div className="flight-duration">
                    <small>{flight.duration}</small>
                    <p>──────── ✈ ────────</p>
                    <small>Non-stop</small>
                  </div>

                  <div>
                    <h3>{flight.arrival}</h3>
                    <p>{flight.to}</p>
                  </div>
                </div>

                <div className="flight-price">
                  <small>
                    {passengers} Passenger
                    {passengers > 1 ? 's' : ''}
                  </small>

                  <h2>
                    ₹{(flight.price * passengers)
                      .toLocaleString('en-IN')}
                  </h2>

                  <small>
                    ₹{flight.price.toLocaleString('en-IN')}
                    {' '}per person
                  </small>

                  <button
                    type="button"
                    disabled={bookingInProgress}
                    onClick={() => bookFlight(flight)}
                  >
                    {bookingInProgress ? 'Saving Booking...' : 'Book Now'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}

export default Flights
