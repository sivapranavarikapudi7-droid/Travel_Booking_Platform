
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'

import { useAuth } from './AuthContext'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const { user } = useAuth()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  // Load bookings from MongoDB
  const loadBookings = useCallback(async () => {
    const token = localStorage.getItem('travel_token')

    if (!user || !token) {
      setBookings([])
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/bookings',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load bookings.')
      }

      setBookings(
        data.map(booking => ({
          ...booking,
          id: booking._id,
          ...booking.details,
          type: booking.type,
          status: booking.status,
          bookedAt: booking.bookedAt
        }))
      )
    } catch (error) {
      console.error('Error loading bookings:', error.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  // Save a new booking in MongoDB
  const addBooking = async (booking) => {
    const token = localStorage.getItem('travel_token')

    if (!user || !token) {
      return false
    }

    try {
      const { type, ...details } = booking

      const response = await fetch(
        'http://localhost:5000/api/bookings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            type,
            details
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save booking.')
      }

      await loadBookings()
      return true
    } catch (error) {
      console.error('Error saving booking:', error.message)
      return false
    }
  }

  // Cancel a booking in MongoDB
  const cancelBooking = async (bookingId) => {
    const token = localStorage.getItem('travel_token')

    if (!user || !token) {
      return false
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel booking.')
      }

      await loadBookings()
      return true
    } catch (error) {
      console.error('Error cancelling booking:', error.message)
      return false
    }
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        myBookings: bookings,
        addBooking,
        cancelBooking,
        loading,
        loadBookings
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const context = useContext(BookingContext)

  if (!context) {
    throw new Error(
      'useBookings must be used inside BookingProvider'
    )
  }

  return context
}
