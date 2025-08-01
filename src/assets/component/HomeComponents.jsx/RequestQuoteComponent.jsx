import React, { useState } from 'react';

export default function RequestQuoteComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    shipmentType: '',
    origin: '',
    destination: '',
    weight: '',
    dimensions: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend or an API
    console.log('Form data submitted:', formData);
    // Add logic for form submission (e.g., API call, success message)
    alert('Thank you for your message! We will get back to you shortly.'); // Using alert for demo, replace with custom modal
    setFormData({ // Clear form after submission
      name: '',
      email: '',
      phone: '',
      shipmentType: '',
      origin: '',
      destination: '',
      weight: '',
      dimensions: '',
      message: '',
    });
  };

//   const steps = [
//     {
//       number: 1,
//       title: 'Request a Quote & Plan',
//       description: 'Easily submit your shipment details through our online form or contact us directly. Our experts will provide a tailored quote and help you plan the most efficient logistics solution for your cargo.',
//     },
//     {
//       number: 2,
//       title: 'Secure Pickup & Transit',
//       description: 'Once confirmed, our team will arrange for secure pickup of your cargo. We utilize advanced tracking systems to monitor your shipment throughout its journey, ensuring safety and transparency.',
//     },
//     {
//       number: 3,
//       title: 'Timely Delivery & Support',
//       description: 'Your cargo will be delivered to its destination on schedule. Our dedicated support team is available 24/7 to provide updates and assist with any queries, ensuring a smooth delivery process.',
//     },
//   ];

  const shipmentTypes = [
    { value: '', label: 'Select Shipment Type' },
    { value: 'air', label: 'Air Freight' },
    { value: 'sea', label: 'Sea Freight' },
    { value: 'road', label: 'Road Transport' },
    { value: 'project', label: 'Project Cargo' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <section className="bg-white font-sans py-16 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row justify-center gap-12">
        {/* Right Section: Get In Touch Form */}
        <div className="lg:w-1/2 w-full bg-green-600 p-8 md:p-12 rounded-lg shadow-xl">
          <h2 className="text-3xl font-extrabold text-white mb-8">Request a Free Quote</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <select
                name="shipmentType"
                value={formData.shipmentType}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300"
                required
              >
                {shipmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                name="origin"
                placeholder="Origin (e.g., City, Country)"
                value={formData.origin}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <input
                type="text"
                name="destination"
                placeholder="Destination (e.g., City, Country)"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <input
                type="number"
                name="weight"
                placeholder="Cargo Weight (e.g., in kg or lbs)"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <input
                type="text"
                name="dimensions"
                placeholder="Cargo Dimensions (e.g., L x W x H in cm)"
                value={formData.dimensions}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Your Message (e.g., specific requirements)"
                rows="5"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gray-800 text-white font-bold rounded-md shadow-md hover:bg-gray-700 transition duration-300 ease-in-out"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
