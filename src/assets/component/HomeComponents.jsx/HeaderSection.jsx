import { Link } from "react-router-dom";
import { useState } from "react";
import user from '../../images/user.svg';
import cargorealmlogo from '../../images/cargorealmlogo.png';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import MessageSlides from "./MessageSlides";

export default function HeaderSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  // NavLinks to include sub-menus
  const navLinks = [
    { href: "/", label: "Home" },
    {
      label: "About Us",
      submenus: [
        { href: "/app/about", label: "About Us" },
        { href: "/app/gallery", label: "Gallery" }, 
        { href: "/app/events", label: "Events" }, 
      ]
    },
    { href: "/app/services", label: "Our Services" },
    { href: "/app/trackshipment", label: "Track Shipment" },
    { href: "/app/requestquote", label: "Request Quote" },
    { href: "/app/contactus", label: "Contact Us" },
  ];

  return (
    <header className="bg-white p-0 shadow-sm sticky top-0 z-50">
      <MessageSlides />
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
            <img
                src={cargorealmlogo}
                alt="Adesola Plastic Stores Logo"
                className="h-[40px] w-[130px] md:h-[52px] md:w-[250px] mr-0"
            />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-row items-center space-x-4">
          {navLinks.map((link, index) => {
            // Check if the link has sub-menus
            if (link.submenus) {
              return (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setAboutDropdownOpen(true)}
                onMouseLeave={() => setAboutDropdownOpen(false)}
              >
                <span className="text-gray-700 hover:text-green-600 font-medium cursor-pointer transition-colors">
                  {link.label} <ArrowDownLineIcon />
                </span>
                {aboutDropdownOpen && (
                    <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      {link.submenus.map((submenu) => (
                        <Link
                          key={submenu.href}
                          to={submenu.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-green-100 font-semibold transition-colors"
                          onClick={() => setAboutDropdownOpen(false)}
                        >
                          {submenu.label}
                        </Link>
                      ))}
                    </div>
                )}
              </div>
            );
              } else {
              // Render normal links without sub-menus
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              );
            }
          })}
        </nav>

        {/* Login Icons and Button Section (Desktop) */}
        <div className="hidden lg:flex items-center space-x-4">
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
              {navLinks.map((link, index) => {
                if (link.submenus) {
                  return (
                    <div key={index}>
                      <button
                        onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                        className="w-full text-left text-gray-700 hover:text-green-600 font-medium text-lg transition-colors focus:outline-none"
                      >
                        {link.label} <ArrowDownLineIcon />
                      </button>
                      {aboutDropdownOpen && (
                        <div className="flex flex-col space-y-2 pl-4 mt-2">
                          {link.submenus.map((submenu) => (
                            <Link
                              key={submenu.href}
                              to={submenu.href}
                              className="text-gray-600 hover:text-green-600 font-semibold text-base transition-colors"
                              onClick={() => {
                                  setMenuOpen(false);
                                  setAboutDropdownOpen(false);
                              }}
                            >
                              {submenu.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                  } else {
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="text-gray-700 hover:text-green-600 font-medium text-lg transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                );
              }
            })}
            <Link to="/app/requestquote" className="px-6 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center" onClick={() => setMenuOpen(false)}>
                Get A Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}