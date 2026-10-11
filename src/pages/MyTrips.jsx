
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useBookings } from '../context/BookingContext'

import './MyTrips.css'

function MyTrips() {
  const { user } = useAuth()
  const { myBookings, cancelBooking, loading } = useBookings()

  const bookings = myBookings || []

  const [filter, setFilter] = useState('All')
  const [cancellingId, setCancellingId] = useState(null)

  const filteredBookings = bookings.filter(booking =>
    filter === 'All' || booking.type === filter
  )

  const activeBookings = bookings.filter(
    booking => booking.status !== 'Cancelled'
  )

  const totalSpent = activeBookings.reduce(
    (sum, booking) => sum + Number(booking.total || 0),
    0
  )

  const handleCancel = async (id) => {
    if (!id || cancellingId) return

    const confirmed = window.confirm(
      'Are you sure you want to cancel this demo booking?'
    )

    if (!confirmed) return

    setCancellingId(id)

    try {
      const success = await cancelBooking(id)

      if (success) {
        window.alert('Booking cancelled successfully.')
      } else {
        window.alert(
          'Unable to cancel the booking. Please try again.'
        )
      }
    } catch (error) {
      console.error('Cancellation error:', error)
      window.alert('Something went wrong. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  const getIcon = (type) => {
    if (type === 'Flight') return '✈️'
    if (type === 'Hotel') return '🏨'
    if (type === 'Cab') return '🚕'
    return '📍'
  }

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString('en-IN')

  return (
    <div className="trips-page">
      <section className="trips-hero">
        <h1>🧳 My Trips</h1>

        <p>
          Welcome back, {user?.name || 'Traveller'}!
          Manage your bookings in one place.
        </p>
      </section>

      <div className="trips-container">
        <div className="trips-summary">
          <div className="summary-card">
            <span>📋 Total Bookings</span>
            <h2>{bookings.length}</h2>
          </div>

          <div className="summary-card">
            <span>✅ Active Bookings</span>
            <h2>{activeBookings.length}</h2>
          </div>

          <div className="summary-card">
            <span>💰 Total Demo Value</span>
            <h2>₹{formatPrice(totalSpent)}</h2>
          </div>
        </div>

        <div className="trips-heading">
          <h2>Your Bookings</h2>

          <div className="trips-filters">
            {['All', 'Flight', 'Hotel', 'Cab'].map(item => (
              <button
                key={item}
                type="button"
                className={
                  filter === item
                    ? 'trip-filter active'
                    : 'trip-filter'
                }
                onClick={() => setFilter(item)}
              >
                {item === 'All' ? 'All Bookings' : item}
              </button>
            ))}
          </div>
        </div>

        {loading && bookings.length === 0 && (
          <div className="trips-empty">
            <h2>Loading your bookings...</h2>
          </div>
        )}

        {!loading && filteredBookings.length === 0 && (
          <div className="trips-empty">
            <div className="trips-empty-icon">🧳</div>

            <h2>No Bookings Found</h2>

            <p>
              You don't have any bookings in this category yet.
            </p>

            <Link to="/explore">
              Explore Destinations
            </Link>
          </div>
        )}

        <div className="trips-list">
          {filteredBookings.map(booking => (
            <div className="trip-card" key={booking.id}>
              <div className="trip-card-header">
                <div className="trip-type">
                  <span className="trip-icon">
                    {getIcon(booking.type)}
                  </span>

                  <div>
                    <small>{booking.type} Booking</small>
                    <h3>{booking.title || `${booking.type} Trip`}</h3>
                  </div>
                </div>

                <span
                  className={
                    booking.status === 'Cancelled'
                      ? 'trip-status cancelled'
                      : 'trip-status confirmed'
                  }
                >
                  {booking.status || 'Confirmed'}
                </span>
              </div>

              {booking.type === 'Flight' && (
                <div className="trip-details">
                  <p><strong>From:</strong> {booking.from}</p>
                  <p><strong>To:</strong> {booking.to}</p>
                  <p><strong>Travel Date:</strong> {booking.date}</p>
                  <p><strong>Passengers:</strong> {booking.passengers}</p>
                  <p><strong>Departure:</strong> {booking.departure}</p>
                  <p><strong>Arrival:</strong> {booking.arrival}</p>
                </div>
              )}

              {booking.type === 'Hotel' && (
                <div className="trip-details">
                  <p><strong>Location:</strong> {booking.location}</p>
                  <p><strong>Check-in:</strong> {booking.date}</p>
                  <p><strong>Check-out:</strong> {booking.checkOut}</p>
                  <p><strong>Nights:</strong> {booking.nights}</p>
                  <p><strong>Guests:</strong> {booking.guests}</p>
                  <p><strong>Rooms:</strong> {booking.rooms}</p>
                </div>
              )}

              {booking.type === 'Cab' && (
                <div className="trip-details">
                  <p><strong>Pickup:</strong> {booking.from}</p>
                  <p><strong>Drop:</strong> {booking.to}</p>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Passengers:</strong> {booking.passengers}</p>
                  <p><strong>Distance:</strong> {booking.distance} km</p>
                </div>
              )}

              <div className="trip-card-footer">
                <div>
                  <small>Demo Booking Total</small>
                  <h2>₹{formatPrice(booking.total)}</h2>
                </div>

                {booking.status !== 'Cancelled' && (
                  <button
                    type="button"
                    className="cancel-trip-btn"
                    disabled={cancellingId !== null}
                    onClick={() => handleCancel(booking.id)}
                  >
                    {cancellingId === booking.id
                      ? 'Cancelling...'
                      : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="trips-disclaimer">
          These are demonstration bookings only. No real reservation,
          payment, cancellation or refund is processed.
        </p>
      </div>
    </div>
  )
}

export default MyTrips
