import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import donate2 from '../../images/donate2.svg';
import account from '../../images/account.svg';
import caclogo2 from '../../images/caclogo2.png';
import logo1 from '../../images/logo1.png';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-500 text-white px-4 font-inter sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-2">
        {/* Logo */}
        <div className="flex items-center">
          {/* Using a placeholder image or simple text for the logo */}
          <img
            src={logo1}
            alt="Adesola Plastic Stores Logo"
            className="h-13 w-14 rounded-full mr-0"
          />
          <span className="text-[15px] md:text-[18px] lg:text-[20px] font-bold">CAC Lightway Assembly</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6 text-lg">
          <Link to="/" className="hover:text-orange-400 transition-colors duration-300">Home</Link>
          <Link to="/app/about" className="hover:text-orange-400 transition-colors duration-300">About Us</Link>
          <Link to="/app/prayerrequest" className="hover:text-orange-400 transition-colors duration-300">Prayer Requests</Link>
          <Link to="/app/blog" className="hover:text-orange-400 transition-colors duration-300">Blog</Link>
          <Link to="/app/gallery" className="hover:text-orange-400 transition-colors duration-300">Gallery</Link>
          <Link to="/app/contactus" className="hover:text-orange-400 transition-colors duration-300">Contact Us</Link>
        </div>

        {/* Icons for Desktop (User, Wishlist, Cart) */}
        <div className="hidden lg:flex items-center space-x-4">
            <Link to="/app/dashboard" className="hover:text-orange-400 transition-colors duration-300">
                <img 
                src={account} 
                alt={account} 
                className='w-7 h-7 text-blue-500' 
                />
            </Link>
            <Link to="/app/donate" className="hover:text-orange-400 transition-colors duration-300">
                <img 
                src={donate2} 
                alt={donate2} 
                className='w-7 h-7 text-blue-500' 
                />
            </Link>
          <Link to="/app/worshipwithus" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-300">Worship With Us</Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden flex items-center">
          {/* Mobile Icons (User, Cart) */}
          <Link to="/login" className="hover:text-orange-400 transition-colors duration-300 mr-5">
                <img 
                src={account} 
                alt={account} 
                className='w-7 h-7 text-blue-500' 
                />
          </Link>
          <Link to="/app/donate" className="hover:text-orange-400 transition-colors duration-300 mr-4">
                <img 
                src={donate2} 
                alt={donate2} 
                className='w-7 h-7 text-blue-500' 
                />
          </Link>
          <Link to="/app/worshipwithus" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-300 hidden md:block lg:hidden mr-5">Worship With Us</Link>

          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      <div
        className={`lg:hidden ${
          isOpen ? 'block' : 'hidden'
        } bg-black py-2 px-4 transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col space-y-2">
          <Link to="/" className="hover:text-orange-400 transition-colors duration-300">Home</Link>
          <Link to="/app/about" className="hover:text-orange-400 transition-colors duration-300">About Us</Link>
          <Link to="/app/prayerrequest" className="hover:text-orange-400 transition-colors duration-300">Prayer Requests</Link>
          <Link to="/app/blog" className="hover:text-orange-400 transition-colors duration-300">Blog</Link>
          <Link to="/app/gallery" className="hover:text-orange-400 transition-colors duration-300">Gallery</Link>
          <Link to="/app/contactus" className="hover:text-orange-400 transition-colors duration-300">Contact Us</Link>
          <Link to="/app/worshipwithus" className="bg-orange-500 text-center text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-300 mt-2">Worship With Us</Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
