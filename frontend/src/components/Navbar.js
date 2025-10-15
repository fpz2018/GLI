import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GLI Zeist</h1>
              <p className="text-sm text-gray-500">Gecombineerde Leefstijlinterventie</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              data-testid="nav-home"
            >
              Home
            </Link>
            <Link 
              to="/programs" 
              className={`nav-link ${isActive('/programs') ? 'active' : ''}`}
              data-testid="nav-programs"
            >
              Programma's
            </Link>
            <Link 
              to="/coaches" 
              className={`nav-link ${isActive('/coaches') ? 'active' : ''}`}
              data-testid="nav-coaches"
            >
              Coaches
            </Link>
            <Link 
              to="/gli-groepen" 
              className={`nav-link ${isActive('/gli-groepen') ? 'active' : ''}`}
              data-testid="nav-gli-groepen"
            >
              GLI Groepen
            </Link>
            <Link 
              to="/gli-aanbieders" 
              className={`nav-link ${isActive('/gli-aanbieders') ? 'active' : ''}`}
              data-testid="nav-gli-aanbieders"
            >
              GLI Aanbieders
            </Link>
            <Link 
              to="/verwijzerstool" 
              className={`nav-link ${isActive('/verwijzerstool') ? 'active' : ''}`}
              data-testid="nav-verwijzerstool"
            >
              Verwijzerstool
            </Link>
            <Link 
              to="/faq" 
              className={`nav-link ${isActive('/faq') ? 'active' : ''}`}
              data-testid="nav-faq"
            >
              FAQ
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
              data-testid="nav-contact"
            >
              Contact
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                  data-testid="nav-dashboard"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Welkom, {user.name}
                  </span>
                  <span className={`status-badge ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'professional' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'verwijzer' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline text-sm"
                  data-testid="logout-btn"
                >
                  Uitloggen
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="btn btn-outline text-sm"
                  data-testid="login-btn"
                >
                  Inloggen
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary text-sm"
                  data-testid="register-btn"
                >
                  Registreren
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col space-y-1"
            data-testid="mobile-menu-btn"
          >
            <span className={`w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="py-4 space-y-4 border-t border-gray-200">
            <Link to="/" className="block nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/programs" className="block nav-link" onClick={() => setIsMenuOpen(false)}>
              Programma's
            </Link>
            <Link to="/coaches" className="block nav-link" onClick={() => setIsMenuOpen(false)}>
              Coaches
            </Link>
            <Link to="/gli-groepen" className="block nav-link" onClick={() => setIsMenuOpen(false)}>
              GLI Groepen
            </Link>
            <Link to="/gli-aanbieders" className="block nav-link" onClick={() => setIsMenuOpen(false)}>
              GLI Aanbieders
            </Link>
            <Link to="/verwijzerstool" className="block nav-link" onClick={() => setIsMenuOpen(false)}>
              Verwijzerstool
            </Link>
            <Link to="/faq" className="block nav-link" onClick={() => setIsMenuOpen(false)}>
              FAQ
            </Link>
            <Link to="/contact" className="block nav-link" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            
            {user ? (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Link to="/dashboard" className="block nav-link" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <div className="text-sm text-gray-700">
                  Welkom, {user.name} ({user.role})
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="btn btn-outline text-sm w-full"
                >
                  Uitloggen
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Link 
                  to="/login" 
                  className="btn btn-outline text-sm w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inloggen
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary text-sm w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registreren
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;