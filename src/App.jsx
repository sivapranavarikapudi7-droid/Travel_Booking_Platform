
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Flights from './pages/Flights'
import Hotels from './pages/Hotels'
import Cabs from './pages/Cabs'
import Explore from './pages/Explore'

import Login from './pages/Login'
import Register from './pages/Register'
import MyTrips from './pages/MyTrips'
import AdminDashboard from './pages/AdminDashboard'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/cabs" element={<Cabs />} />
            <Route path="/explore" element={<Explore />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/my-trips"
              element={
                <ProtectedRoute>
                  <MyTrips />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={<AdminDashboard />}
            />
          </Routes>

          <Footer />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
