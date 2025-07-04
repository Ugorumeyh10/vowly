import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import StoryPage from './StoryPage';
import GalleryPage from './GalleryPage';
import GuestPage from './GuestPage';
import WishlistPage from './WishlistPage';

// A style tag is added here to import the 'Great Vibes' font for a romantic aesthetic.
// For a production app, it's better to add this font import to your main index.html or a global CSS file.
const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
  .font-great-vibes {
    font-family: 'Great Vibes', cursive;
  }
`;

const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-rose-200 text-rose-800'
        : 'text-gray-600 hover:bg-rose-100 hover:text-rose-700'
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `block w-full text-center py-3 text-lg ${
      isActive ? 'font-bold text-rose-700' : 'text-gray-700'
    }`;

  return (
    <>
      <style>{pageStyles}</style>
      <div
        className="min-h-screen font-serif text-gray-800"
        style={{ background: 'radial-gradient(circle, hsl(355, 100%, 97%), hsl(355, 81%, 95%))' }}
      >
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 relative">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-3">
              <h1 className="text-4xl font-great-vibes text-rose-800">Vowly</h1>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-2 md:space-x-4">
                <NavLink to="/story" className={navLinkClasses}>Our Story</NavLink>
                <NavLink to="/gallery" className={navLinkClasses}>Gallery</NavLink>
                <NavLink to="/guests" className={navLinkClasses}>Guests</NavLink>
                <NavLink to="/wishlist" className={navLinkClasses}>Wishlist</NavLink>
              </nav>
              <div className="hidden md:flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
                    <button onClick={logout} className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition duration-200 text-sm">Log Out</button>
                  </>
                ) : (
                  <Link to="/login" className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition duration-200 text-sm">Log In</Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-rose-800">
                  {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm shadow-lg flex flex-col items-center">
              <nav className="w-full">
                <NavLink to="/story" className={mobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>Our Story</NavLink>
                <NavLink to="/gallery" className={mobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>Gallery</NavLink>
                <NavLink to="/guests" className={mobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>Guests</NavLink>
                <NavLink to="/wishlist" className={mobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>Wishlist</NavLink>
              </nav>
              <div className="w-full p-4 mt-2 border-t border-rose-100">
                {isAuthenticated ? (
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition duration-200 text-sm">Log Out</button>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition duration-200 text-sm">Log In</Link>
                )}
              </div>
            </div>
          )}
        </header>
        <main>
          <Routes>
            <Route path="/story" element={<StoryPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/guests" element={<GuestPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            {/* Redirect from the base path to the story page */}
            <Route path="/" element={<Navigate to="/story" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default Dashboard;