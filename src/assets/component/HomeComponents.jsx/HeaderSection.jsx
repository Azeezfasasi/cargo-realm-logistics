'use client';
import { Link } from "react-router-dom";
import { useState } from "react";
import user from '../../images/user.svg';

export default function HeaderSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/app/about", label: "About Us" },
    { href: "/app/services", label: "Our Services" },
    { href: "/app/trackshipment", label: "Track Shipment" },
    { href: "/app/requestquote", label: "Request Quote" },
    { href: "/app/contactus", label: "Contact Us" },
  ];

  return (
    <header className="bg-white p-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001 1h3v-3m-3 3h3v-3m-3 0V9a1 1 0 011-1h2a1 1 0 011 1v10m-6 0h6"
            ></path>
          </svg>
          <span className="text-xl font-semibold text-gray-800">Cargo Tracking</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-row items-center space-x-4">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Login Icons and Button Section (Desktop) */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Login Icon */}
          <div>
            <a href="/app/dashboard" className="hidden md:inline-flex items-center p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <img
                src={user}
                alt="Login Icon"
                width={32}
                height={32}
              />
            </a>
          </div>

          {/* Get A Quote Button */}
          <Link to="/app/requestquote" className="px-6 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 z-50">
            Get A Quote
          </Link>
        </div>

        {/* Mobile Account Icon and Hamburger Menu */}
        <div className="flex flex-row lg:hidden">
          <a href="/app/dashboard" className="flex items-center p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <img
              src={user}
              alt="Login Icon"
              width={30}
              height={30}
            />
          </a>
          
          {/* Hamburger Menu (Mobile) */}
          <button
            className="lg:hidden flex items-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Open main menu</span>
            <div className="relative w-7 h-7 flex flex-col justify-center items-center">
              <span
                className={`block h-1 w-7 bg-gray-800 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
              ></span>
              <span
                className={`block h-1 w-7 bg-gray-800 rounded my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
              ></span>
              <span
                className={`block h-1 w-7 bg-gray-800 rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <nav className="lg:hidden bg-white shadow-lg rounded-b-lg py-4 px-6 absolute left-0 right-0 top-full z-40 animate-slideDown">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium text-lg transition-colors" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/app/about" className="text-gray-700 hover:text-green-600 font-medium text-lg transition-colors" onClick={() => setMenuOpen(false)}>
              About Us
            </Link>
            <Link to="/app/services" className="text-gray-700 hover:text-green-600 font-medium text-lg transition-colors" onClick={() => setMenuOpen(false)}>
              Our Services
            </Link>
            <Link to="/app/trackshipment" className="text-gray-700 hover:text-green-600 font-medium text-lg transition-colors" onClick={() => setMenuOpen(false)}>
              Track Shipment
            </Link>
            <Link to="/app/requestquote" className="text-gray-700 hover:text-green-600 font-medium text-lg transition-colors" onClick={() => setMenuOpen(false)}>
              Request Quote
            </Link>
            <Link to="/app/contactus" className="text-gray-700 hover:text-green-600 font-medium text-lg transition-colors" onClick={() => setMenuOpen(false)}>
              Contact Us
            </Link>
            <Link to="/app/requestquote" className="px-6 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center" onClick={() => setMenuOpen(false)}>
              Get A Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
