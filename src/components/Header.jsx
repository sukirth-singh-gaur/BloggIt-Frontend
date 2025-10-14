import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, logout } from "../api/apiService";
import { toast } from "react-toastify";
import BloggitLogo from "../assets/logo.svg";
import WriteLogo from "../assets/write.svg";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getProfile();
        setUser(data);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsMenuOpen(false); // Close menu on logout
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  return (
    <header className="relative z-10 bg-white border-b border-gray-200">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img className="h-12 w-auto" src={BloggitLogo} alt="Bloggit Logo" />
        </Link>

        {/* Desktop Menu (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <span className="text-gray-500 font-light">
                Hello, {user.name}
              </span>
              <Link to="/create" className="text-gray-500 font-light flex items-center gap-1 hover:text-indigo-600">
                <img className="h-5 w-5" src={WriteLogo} alt="Write icon" />
                Write
              </Link>
              <button onClick={handleLogout} className="text-gray-500 font-light hover:text-indigo-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-500 font-light hover:text-indigo-600">
                Login
              </Link>
              <Link to="/register" className="text-gray-500 font-light hover:text-indigo-600">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu Button (visible on mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col items-start p-4 space-y-4">
            {user ? (
              <>
                <span className="text-gray-700 font-semibold w-full">
                  Hello, {user.name}
                </span>
                <Link to="/create" onClick={() => setIsMenuOpen(false)} className="text-gray-500 font-light flex items-center gap-1 w-full">
                  <img className="h-5 w-5" src={WriteLogo} alt="Write icon" />
                  Write
                </Link>
                <button onClick={handleLogout} className="text-gray-500 font-light w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-500 font-light w-full">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-gray-500 font-light w-full">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;