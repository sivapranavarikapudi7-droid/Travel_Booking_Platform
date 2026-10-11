
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useBookings } from '../context/BookingContext'

import './Cabs.css'

// Demonstration route distances in kilometres
const routeDistances = {
  'Vijayawada-Guntur': 36,
  'Vijayawada-Hyderabad': 275,
  'Vijayawada-Chennai': 450,
  'Hyderabad-Bangalore': 570,
  'Hyderabad-Vijayawada': 275,
  'Guntur-Vijayawada': 36,
  'Chennai-Vijayawada': 450,
  'Bangalore-Hyderabad': 570
}

const cabTypes = [
  {
    id: 1,
    name: 'Mini',
    icon: '🚗',
    seats: 4,
    description: 'Affordable rides for everyday travel',
    pricePerKm: 15,
    baseFare: 0,
    features: ['AC', '4 Seats', 'Compact Car']
  },
  {
    id: 2,
    name: 'Sedan',
    icon: '🚘',
    seats: 4,
    description: 'Comfortable rides for your journey',
    pricePerKm: 20,
    baseFare: 0,
    features: ['AC', '4 Seats', 'Extra Comfort']
  },
  {
    id: 3,
    name: 'SUV',
    icon: '🚙',
    seats: 6,
    description: 'Spacious rides for families and groups',
    pricePerKm: 28,
    baseFare: 0,
    features: ['AC', '6 Seats', 'Extra Luggage']
  }
]

function Cabs() {

  // Authentication and booking system
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addBooking } = useBookings()

  // Cab search form
  const [pickup, setPickup] = useState('')
  const [drop, setDrop] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [passengers, setPassengers] = useState(1)

  // Search results
  const [distance, setDistance] = useState(0)
  const [searched, setSearched] = useState(false)

  // Today's date
  const today = new Date()

  const minDate =
    today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0')

  // Search available cabs
  const searchCabs = (e) => {
    e.preventDefault()

    if (pickup === drop) {
      alert('Pickup and drop locations cannot be the same!')
      return
    }

    if (date < minDate) {
      alert('Please select a valid future pickup date.')
      return
    }

    if (date === minDate) {
      const now = new Date()
      const selected = new Date(`${date}T${time}:00`)

      if (selected <= now) {
        alert('Please select a future pickup time.')
        return
      }
    }

    const route = `${pickup}-${drop}`
    const routeDistance = routeDistances[route]

    if (!routeDistance) {
      setSearched(false)

      alert(
        'This demo route is not available yet. ' +
        'Try Vijayawada to Guntur.'
      )

      return
    }

    setDistance(routeDistance)
    setSearched(true)
  }

  // Calculate estimated fare
  const calculateFare = (cab) => {
    return cab.baseFare + distance * cab.pricePerKm
  }

  // STEP 27: Save cab booking
  const bookCab = (cab) => {

    // Check whether the user is logged in
    if (!user) {
      alert('Please log in before booking a cab.')
      navigate('/login')
      return
    }

    // Check that a valid search was performed
    if (!searched || distance <= 0) {
      alert('Please search for an available cab first.')
      return
    }

    // Calculate total estimated fare
    const total = calculateFare(cab)

    // Save the selected cab booking
    const saved = addBooking({
      type: 'Cab',
      title: cab.name,
      from: pickup,
      to: drop,
      date: date,
      time: time,
      passengers: passengers,
      distance: distance,
      total: total
    })

    if (!saved) {
      alert('Unable to save booking. Please log in again.')
      return
    }

    // Display confirmation
    alert(
      `Demo cab booking saved successfully!\n\n` +
      `Cab: ${cab.name}\n` +
      `Pickup: ${pickup}\n` +
      `Drop: ${drop}\n` +
      `Date: ${date}\n` +
      `Time: ${time}\n` +
      `Passengers: ${passengers}\n` +
      `Distance: ${distance} km\n` +
      `Estimated Fare: ₹${total.toLocaleString('en-IN')}`
    )

    // Redirect to My Trips
    navigate('/my-trips')
  }

  return (
    <div className="cabs-page">

      <section className="cabs-hero">
        <h1>🚕 Book Your Perfect Ride</h1>
        <p>
          Comfortable, affordable and convenient travel.
        </p>
      </section>

      <section className="cab-search-box">

        <h2>Find Your Cab</h2>

        <form onSubmit={searchCabs}>

          <div className="cab-form-grid">

            <div className="cab-input">
              <label>Pickup Location</label>

              <select
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value)
                  setSearched(false)
                }}
                required
              >
                <option value="">Select Pickup</option>
                <option>Vijayawada</option>
                <option>Guntur</option>
                <option>Hyderabad</option>
                <option>Chennai</option>
                <option>Bangalore</option>
              </select>
            </div>

            <div className="cab-input">
              <label>Drop Location</label>

              <select
                value={drop}
                onChange={(e) => {
                  setDrop(e.target.value)
                  setSearched(false)
                }}
                required
              >
                <option value="">Select Destination</option>
                <option>Vijayawada</option>
                <option>Guntur</option>
                <option>Hyderabad</option>
                <option>Chennai</option>
                <option>Bangalore</option>
              </select>
            </div>

            <div className="cab-input">
              <label>Pickup Date</label>

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

            <div className="cab-input">
              <label>Pickup Time</label>

              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value)
                  setSearched(false)
                }}
                required
              />
            </div>

            <div className="cab-input">
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

          <button type="submit" className="cab-search-btn">
            Search Cabs
          </button>

        </form>
      </section>

      {searched && (
        <section className="cab-results">

          <h2>Available Cabs</h2>

          <p className="cab-route-info">
            {pickup} → {drop} · Approx. {distance} km
          </p>

          <div className="cab-grid">

            {cabTypes
              .filter(cab => cab.seats >= passengers)
              .map(cab => (

                <div className="cab-card" key={cab.id}>

                  <div className="cab-card-top">

                    <div className="cab-icon">
                      {cab.icon}
                    </div>

                    <div>
                      <h3>{cab.name}</h3>
                      <p>{cab.description}</p>
                    </div>

                  </div>

                  <div className="cab-features">

                    {cab.features.map(feature => (
                      <span key={feature}>
                        {feature}
                      </span>
                    ))}

                  </div>

                  <div className="cab-fare">

                    <div>
                      <p>Estimated Fare</p>

                      <h2>
                        ₹{calculateFare(cab)
                          .toLocaleString('en-IN')}
                      </h2>

                      <small>
                        ₹{cab.pricePerKm}/km
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={() => bookCab(cab)}
                    >
                      Book Now
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

export default Cabs
