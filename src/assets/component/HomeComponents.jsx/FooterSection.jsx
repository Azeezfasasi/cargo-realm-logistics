import React from 'react';

export default function FooterSection() {
  const cargoServices = [
    'Air Freight',
    'Sea Freight',
    'Road Transport',
    'Warehousing',
    'Customs Brokerage',
    'Project Cargo',
    'Supply Chain Solutions',
    'Express Delivery',
  ];

  const quickLinks = [
    { name: 'Services', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Contact Us', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 font-sans">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Logo and Description */}
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2 mb-4">
            {/* Using an SVG for the logo as it's scalable and matches the image */}
            <svg
              className="w-8 h-8 text-green-600"
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
            <span className="text-xl font-semibold text-white">Care Cargo</span>
          </div>
          <p className="text-sm leading-relaxed">
            Your reliable partner for global cargo shipments. We provide efficient, secure, and timely logistics solutions tailored to your business needs, ensuring your goods reach their destination with care.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="text-gray-300 hover:text-green-600 transition duration-200">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 & 4: Our Services */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="text-lg font-bold text-white mb-4">Our Services</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            {cargoServices.map((service, index) => (
              <li key={index} className="list-none">
                <a href="#" className="text-gray-300 hover:text-green-600 transition duration-200">
                  {service}
                </a>
              </li>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Copyright */}
      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Care Cargo. All rights reserved.
      </div>
    </footer>
  );
}
