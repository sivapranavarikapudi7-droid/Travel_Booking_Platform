
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        ✈ Travel
      </Link>

      <div className="nav-links">

        <Link to="/">Home</Link>
        <Link to="/flights">Flights</Link>
        <Link to="/hotels">Hotels</Link>
        <Link to="/cabs">Cabs</Link>
        <Link to="/explore">Explore</Link>

        {user && (
          <Link to="/my-trips">My Trips</Link>
        )}

      </div>

      <div className="nav-buttons">

        {user ? (

          <>
            <span className="nav-username">
              Hi, {user.name}
            </span>

            <button
              className="signup-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>

        ) : (

          <>
            <Link to="/login" className="login-btn nav-auth-link">
              Login
            </Link>

            <Link to="/register" className="signup-btn nav-auth-link">
              Sign Up
            </Link>
          </>

        )}

      </div>

    </nav>
  )
}

export default Navbar
