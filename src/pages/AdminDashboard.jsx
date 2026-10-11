
import { Link } from 'react-router-dom'
import { useBookings } from '../context/BookingContext'
import './AdminDashboard.css'

function AdminDashboard() {
  const { bookings = [], loading, loadBookings } = useBookings()

  const getType = (booking) =>
    String(booking.type || booking.bookingType || '')
      .trim()
      .toLowerCase()
      .replace(/s$/, '')

  const flightCount = bookings.filter(
    (booking) => getType(booking) === 'flight'
  ).length

  const hotelCount = bookings.filter(
    (booking) => getType(booking) === 'hotel'
  ).length

  const cabCount = bookings.filter(
    (booking) => getType(booking) === 'cab'
  ).length

  const getDetails = (booking) =>
    booking.to ||
    booking.destination ||
    booking.hotelName ||
    booking.name ||
    booking.from ||
    'Booking details'

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="admin-label">ADMIN PANEL</p>
          <h1>Travel Dashboard</h1>
          <p>Manage your saved travel demo bookings.</p>
        </div>

        <div>
          <button
            type="button"
            className="admin-home-btn"
            onClick={loadBookings}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Bookings'}
          </button>

          <Link to="/" className="admin-home-btn">
            Back to Home
          </Link>
        </div>
      </header>

      <section className="admin-stats">
        <div className="admin-stat-card">
          <span>📋</span>
          <h3>Total Bookings</h3>
          <strong>{bookings.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>✈️</span>
          <h3>Flight Bookings</h3>
          <strong>{flightCount}</strong>
        </div>

        <div className="admin-stat-card">
          <span>🏨</span>
          <h3>Hotel Bookings</h3>
          <strong>{hotelCount}</strong>
        </div>

        <div className="admin-stat-card">
          <span>🚕</span>
          <h3>Cab Bookings</h3>
          <strong>{cabCount}</strong>
        </div>
      </section>

      <section className="admin-bookings">
        <h2>Saved Bookings</h2>

        {loading && <p>Loading bookings...</p>}

        {!loading && bookings.length === 0 ? (
          <p className="admin-empty">
            No bookings found for the currently logged-in user.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Type</th>
                  <th>Details</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking._id || booking.id || index}>
                    <td>
                      {booking._id || booking.id || `#${index + 1}`}
                    </td>
                    <td>
                      {booking.type || booking.bookingType || 'Other'}
                    </td>
                    <td>{getDetails(booking)}</td>
                    <td>{booking.status || 'Saved'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="admin-demo-notice">
        Demo project only. No real reservations or payments are processed.
      </p>
    </main>
  )
}

export default AdminDashboard
