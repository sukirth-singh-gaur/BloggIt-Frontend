import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../api/apiService";
import BloggitLogo from "../assets/logo.svg";
import WriteLogo from "../assets/write.svg";
import { useUser, UserButton } from '@clerk/clerk-react';

const Header = () => {
  const { user: clerkUser, isSignedIn } = useUser();
  const [mongoUser, setMongoUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getProfile();
        setMongoUser(data);
      } catch (error) {
        setMongoUser(null);
      }
    };
    
    // Attempt to fetch DB profile if signed in via Clerk
    if (isSignedIn) {
        fetchUser();
    }
  }, [isSignedIn]);

  // Determine which user object to display
  // Use DB data if available, fallback to Clerk user data
  const displayUser = isSignedIn ? (mongoUser || { name: clerkUser?.fullName }) : null;

  return (
    <header className="relative z-10 bg-white border-b border-gray-200">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img className="h-12 w-auto" src={BloggitLogo} alt="Bloggit Logo" />
        </Link>
        
        {/* Desktop Menu (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-6">
          {isSignedIn ? (
            <>
              <span className="text-gray-500 font-light">
                Hello, {displayUser?.name || 'User'}
              </span>
              <Link to="/create" className="text-gray-500 font-light flex items-center gap-1 hover:text-indigo-600">
                <img className="h-5 w-5" src={WriteLogo} alt="Write icon" />
                Write
              </Link>
              
               {/* Show UserButton for Clerk users */}
              <UserButton afterSignOutUrl="/"/>
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
            {isSignedIn ? (
              <>
                <span className="text-gray-700 font-semibold w-full">
                  Hello, {displayUser?.name || 'User'}
                </span>
                <Link to="/create" onClick={() => setIsMenuOpen(false)} className="text-gray-500 font-light flex items-center gap-1 w-full">
                  <img className="h-5 w-5" src={WriteLogo} alt="Write icon" />
                  Write
                </Link>
                {/* Mobile logout is handled by the widget natively, but we can just ask them to use desktop widget or add a signout hook */}
                <div className="pt-2">
                    <UserButton afterSignOutUrl="/" />
                </div>
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