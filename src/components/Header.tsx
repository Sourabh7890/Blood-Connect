import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Droplet, Menu, X, User, LogOut, Search, Home } from 'lucide-react'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      setIsMenuOpen(false)
    } catch (error) {
      // Error is handled in logout function
    }
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    
    switch (user.role) {
      case 'donor':
        return '/donor'
      case 'recipient':
        return '/recipient'
      case 'admin':
        return '/admin'
      default:
        return '/'
    }
  }

  const handleSearchClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      navigate('/login')
      return
    }
    
    if (user?.role !== 'recipient') {
      e.preventDefault()
      navigate('/register')
      return
    }
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Droplet className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold text-gray-900">Blood<span className="text-red-600">Connect</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-red-600 transition duration-200">Home</Link>
            
            {/* Find Blood - Always visible but with smart routing */}
            <Link 
              to="/search" 
              onClick={handleSearchClick}
              className="text-gray-700 hover:text-red-600 transition duration-200 flex items-center"
            >
              <Search className="h-4 w-4 mr-1" />
              Find Blood
            </Link>
            
            {isAuthenticated && (
              <Link to={getDashboardLink()} className="text-gray-700 hover:text-red-600 transition duration-200">
                Dashboard
              </Link>
            )}
            
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-red-600 transition duration-200">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-700 hover:text-red-600 transition duration-200 flex items-center">
                  <User className="h-5 w-5 mr-1" />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition duration-200 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-red-600 transition duration-200 flex items-center" onClick={() => setIsMenuOpen(false)}>
                <Home className="h-5 w-5 mr-2" />
                Home
              </Link>
              
              {/* Find Blood - Always visible in mobile */}
              <Link 
                to="/search" 
                onClick={(e) => {
                  handleSearchClick(e)
                  setIsMenuOpen(false)
                }}
                className="text-gray-700 hover:text-red-600 transition duration-200 flex items-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Find Blood
              </Link>
              
              {isAuthenticated && (
                <Link 
                  to={getDashboardLink()} 
                  className="text-gray-700 hover:text-red-600 transition duration-200 flex items-center" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Droplet className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
              )}
              
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-red-600 transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 inline-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-red-600 transition duration-200 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition duration-200 flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header