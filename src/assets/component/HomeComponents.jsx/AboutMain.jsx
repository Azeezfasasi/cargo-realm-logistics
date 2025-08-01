import React from 'react';

function AboutMain() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white font-inter">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
          About Cargo Realm and Logistics
        </h2>
        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed mb-12">
          Discover our journey, our beliefs, and the heart behind everything we do.
        </p>

        {/* Introduction Section */}
        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row items-stretch mb-16">
          {/* Image */}
          <div className="lg:w-1/2 flex-shrink-0">
            <img
              src="https://placehold.co/800x600/D1D5DB/4B5563/png?text=Our+Community" // Placeholder for your church community image
              alt="Church community gathering"
              className="w-full h-64 sm:h-80 lg:h-full object-cover object-center"
            />
          </div>
          {/* Text Content */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-center text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Story and Purpose
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Founded in 1985, our church has been a beacon of hope and faith in the community for decades. We believe in fostering a vibrant, welcoming environment where individuals and families can grow in their spiritual journey. Our purpose is to spread the message of love, compassion, and service, impacting lives both locally and globally.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are committed to building strong relationships, nurturing faith through biblical teachings, and engaging in meaningful outreach initiatives that make a tangible difference in the world.
            </p>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Our Mission */}
          <div className="bg-blue-50 p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="mb-6 p-4 rounded-full bg-blue-100 text-blue-700">
              {/* Mission Icon (e.g., Target/Goal) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7-7-7M19 10v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To glorify God by making disciples of Jesus Christ who are growing in faith, serving others, and sharing the Gospel with the world.
            </p>
          </div>

          {/* Our Vision */}
          <div className="bg-orange-50 p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="mb-6 p-4 rounded-full bg-orange-100 text-orange-700">
              {/* Vision Icon (e.g., Lightbulb/Idea) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 17v5m6.447-16.632a8 8 0 11-12.894 0M12 2v2m-5.447 10.632a8 8 0 1110.894 0M12 10V6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To be a vibrant, Christ-centered community transforming lives and impacting our city with the love of God.
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <h3 className="text-3xl font-bold text-gray-900 mb-10">
          Our Core Values
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Value 1 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              <span className="text-orange-600 mr-2">&bull;</span> Faith in Action
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              We believe in living out our faith through tangible acts of service and love in our community and beyond.
            </p>
          </div>
          {/* Value 2 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              <span className="text-orange-600 mr-2">&bull;</span> Welcoming Community
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Creating an inclusive and loving environment where everyone feels valued and belongs, regardless of background.
            </p>
          </div>
          {/* Value 3 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              <span className="text-orange-600 mr-2">&bull;</span> Biblical Teaching
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Committed to sound biblical teaching that inspires growth and deeper understanding of God's Word.
            </p>
          </div>
          {/* Value 4 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              <span className="text-orange-600 mr-2">&bull;</span> Compassionate Outreach
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Extending God's love and mercy to those in need, locally and globally, through various outreach programs.
            </p>
          </div>
          {/* Value 5 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              <span className="text-orange-600 mr-2">&bull;</span> Spiritual Growth
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Encouraging and equipping individuals to grow in their personal relationship with Jesus Christ.
            </p>
          </div>
          {/* Value 6 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              <span className="text-orange-600 mr-2">&bull;</span> Generous Giving
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Inspiring a spirit of generosity in giving our time, talents, and resources to God's work.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            Ready to become a part of our family?
          </p>
          <a
            href="#" // Link to Join Us / Get Involved page
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Join Our Community
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default AboutMain;
