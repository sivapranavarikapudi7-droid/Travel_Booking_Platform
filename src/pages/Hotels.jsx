
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useBookings } from '../context/BookingContext'

import './Hotels.css'

const hotelsData = [
  {
    id: 1,
    name: 'Ocean Paradise Resort',
    city: 'Goa',
    rating: 4.8,
    price: 4500,
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900',
    amenities: ['Free WiFi', 'Swimming Pool', 'Breakfast']
  },
  {
    id: 2,
    name: 'Grand Palace Hotel',
    city: 'Hyderabad',
    rating: 4.6,
    price: 3200,
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900',
    amenities: ['Free WiFi', 'Restaurant', 'Parking']
  },
  {
    id: 3,
    name: 'Mountain View Retreat',
    city: 'Manali',
    rating: 4.9,
    price: 3800,
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900',
    amenities: ['Mountain View', 'Breakfast', 'Free WiFi']
  },
  {
    id: 4,
    name: 'Royal Heritage Stay',
    city: 'Jaipur',
    rating: 4.7,
    price: 5200,
    image:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900',
    amenities: ['Swimming Pool', 'Restaurant', 'AC']
  },
  {
    id: 5,
    name: 'City Comfort Suites',
    city: 'Bangalore',
    rating: 4.5,
    price: 2800,
    image:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900',
    amenities: ['Free WiFi', 'Parking', 'AC']
  },
  {
    id: 6,
    name: 'Sea Breeze Residency',
    city: 'Goa',
    rating: 4.4,
    price: 2500,
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900',
    amenities: ['Beach Access', 'Free WiFi', 'Restaurant']
  }
]

function Hotels() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addBooking } = useBookings()

  // Search form
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [rooms, setRooms] = useState(1)

  // Search results
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)

  // Prevent repeated booking clicks
  const [bookingInProgress, setBookingInProgress] = useState(false)

  const today = new Date()

  const minDate =
    today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0')

  // Calculate number of nights
  const getNights = () => {
    if (!checkIn || !checkOut) return 0

    const start = new Date(checkIn + 'T00:00:00')
    const end = new Date(checkOut + 'T00:00:00')

    return Math.round(
      (end - start) / (1000 * 60 * 60 * 24)
    )
  }

  // Search hotels
  const searchHotels = (e) => {
    e.preventDefault()

    if (getNights() <= 0) {
      alert('Check-out must be after check-in!')
      return
    }

    if (guests > rooms * 2) {
      alert('Please select enough rooms. Maximum 2 guests per room.')
      return
    }

    const filtered = hotelsData.filter(
      hotel => hotel.city === destination
    )

    setResults(filtered)
    setSearched(true)
  }

  // Save hotel booking to MongoDB
  const bookHotel = async (hotel) => {
    if (!user) {
      alert('Please log in before booking a hotel.')
      navigate('/login')
      return
    }

    if (bookingInProgress) return

    const nights = getNights()

    if (nights <= 0 || guests > rooms * 2) {
      alert('Please search again with valid booking details.')
      return
    }

    setBookingInProgress(true)

    try {
      const total = hotel.price * nights * rooms

      const saved = await addBooking({
        type: 'Hotel',
        title: hotel.name,
        location: hotel.city,
        date: checkIn,
        checkOut: checkOut,
        nights: nights,
        guests: guests,
        rooms: rooms,
        total: total
      })

      if (!saved) {
        alert('Unable to save booking. Please try again.')
        return
      }

      alert('Demo hotel booking saved successfully!')
      navigate('/my-trips')
    } catch (error) {
      console.error('Hotel booking error:', error)
      alert('Something went wrong while saving your booking.')
    } finally {
      setBookingInProgress(false)
    }
  }

  return (
    <div className="hotels-page">
      <section className="hotels-hero">
        <h1>🏨 Find Your Perfect Stay</h1>
        <p>
          Discover comfortable hotels for your next journey.
        </p>
      </section>

      <section className="hotel-search-box">
        <h2>Search Hotels</h2>

        <form onSubmit={searchHotels}>
          <div className="hotel-form-grid">
            <div className="hotel-input">
              <label>Destination</label>

              <select
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value)
                  setSearched(false)
                }}
                required
              >
                <option value="">Select Destination</option>
                <option>Goa</option>
                <option>Hyderabad</option>
                <option>Manali</option>
                <option>Jaipur</option>
                <option>Bangalore</option>
              </select>
            </div>

            <div className="hotel-input">
              <label>Check-in</label>

              <input
                type="date"
                min={minDate}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value)
                  setCheckOut('')
                  setSearched(false)
                }}
                required
              />
            </div>

            <div className="hotel-input">
              <label>Check-out</label>

              <input
                type="date"
                min={checkIn || minDate}
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value)
                  setSearched(false)
                }}
                required
              />
            </div>

            <div className="hotel-input">
              <label>Guests</label>

              <select
                value={guests}
                onChange={(e) => {
                  setGuests(Number(e.target.value))
                  setSearched(false)
                }}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} Guest{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="hotel-input">
              <label>Rooms</label>

              <select
                value={rooms}
                onChange={(e) => {
                  setRooms(Number(e.target.value))
                  setSearched(false)
                }}
              >
                {[1, 2, 3].map(num => (
                  <option key={num} value={num}>
                    {num} Room{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="hotel-search-btn">
            Search Hotels
          </button>
        </form>
      </section>

      {searched && (
        <section className="hotel-results">
          <h2>Available Hotels in {destination}</h2>

          <p className="hotel-result-info">
            {getNights()} Night(s) · {guests} Guest(s) · {rooms} Room(s)
          </p>

          {results.length === 0 ? (
            <p className="no-hotels">
              No demo hotels found for this destination.
            </p>
          ) : (
            <div className="hotel-grid">
              {results.map(hotel => (
                <div className="hotel-card" key={hotel.id}>
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    loading="lazy"
                  />

                  <div className="hotel-card-content">
                    <h3>{hotel.name}</h3>

                    <p className="hotel-location">
                      📍 {hotel.city}, India
                    </p>

                    <p className="hotel-rating">
                      ⭐ {hotel.rating} / 5
                    </p>

                    <div className="hotel-amenities">
                      {hotel.amenities.map(item => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>

                    <div className="hotel-price">
                      <h2>
                        ₹{hotel.price.toLocaleString('en-IN')}
                      </h2>
                      <span>per room / night</span>
                    </div>

                    <p className="hotel-total">
                      Total:{' '}
                      <strong>
                        ₹{(
                          hotel.price * getNights() * rooms
                        ).toLocaleString('en-IN')}
                      </strong>
                    </p>

                    <button
                      type="button"
                      className="hotel-book-btn"
                      disabled={bookingInProgress}
                      onClick={() => bookHotel(hotel)}
                    >
                      {bookingInProgress
                        ? 'Saving Booking...'
                        : 'Book Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default Hotels
