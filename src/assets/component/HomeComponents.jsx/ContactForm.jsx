import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/Api'; 
import { Link } from 'react-router-dom';

function ContactForm() {
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Mapping "Query Related" to phoneNumber as per model
  const [message, setMessage] = useState('');

  // UI states
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Clear messages when form fields change (except after successful submission)
  useEffect(() => {
    setLocalError('');
    setSuccessMessage('');
  }, [name, email, phoneNumber, message]);

  // Mutation for submitting the contact form
  const submitContactFormMutation = useMutation({
    mutationFn: async (formData) => {
      // This endpoint is public, as per your backend routes
      const response = await axios.post(`${API_BASE_URL}/contact`, formData);
      return response.data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message || 'Your message has been sent successfully! We will get back to you soon.');
      setLocalError(''); // Clear any previous errors

      // Clear form fields after successful submission
      setName('');
      setEmail('');
      setPhoneNumber('');
      setMessage('');
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || 'Failed to send message. Please try again.';
      setLocalError(errorMessage);
      setSuccessMessage(''); // Clear success message on error
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(''); // Clear previous local errors
    setSuccessMessage(''); // Clear previous success messages

    // Client-side validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setLocalError('Name, Email, and Message are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    // Trigger the mutation
    submitContactFormMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim() || undefined, // Send undefined if empty
      message: message.trim(),
    });
  };

  return (
    <section className="bg-gray-200 py-6 px-4 sm:px-6 lg:px-8 font-inter "> {/* Light gray background */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left Section: Contact Form */}
        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider">
            CONTACT FORM:
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {localError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
                <span className="block sm:inline">{localError}</span>
              </div>
            )}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative" role="alert">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder="Your full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 placeholder-gray-500"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 placeholder-gray-500"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Your Phone Number (Optional)" // Changed placeholder for clarity
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 placeholder-gray-500"
              />
            </div>
            <div>
              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="6"
                className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 placeholder-gray-500 resize-y"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-8 py-4 bg-orange-300 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-orange-400 transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={submitContactFormMutation.isPending} // Disable button when loading
            >
              {submitContactFormMutation.isPending ? (
                <svg className="animate-spin h-5 w-5 text-gray-900 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'SEND MESSAGE'
              )}
            </button>
          </form>
        </div>

        {/* Right Section: Contact Details */}
        <div className="text-left lg:pl-12"> {/* Added left padding for larger screens */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-900 mb-2 uppercase">Address</h3>
            <p className="text-gray-700 text-lg font-bold">
              23 Kajola Olayinka Street, Off Ogunlewe Road <br /> Igbogbo, Ikorodu, Lagos.
            </p>
          </div>

          <div className="flex flex-col mb-8">
            <h3 className="text-base font-semibold text-gray-900 mb-2 uppercase">Contact Details</h3>
            <Link to="tel:08069374005" className="text-gray-700 text-lg font-bold w-fit">
              (+234) 08069374005
            </Link>
            <Link to="mailto:info@caclightway.com" className="text-gray-700 text-lg font-bold w-fit">
              info@caclightway.com
            </Link>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4 uppercase">Find us here</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                {/* Facebook Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.812c-3.274 0-4.188 1.549-4.188 4.035v2.965z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                {/* Twitter Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.594 0-6.495 2.902-6.495 6.495 0 .509.058 1.007.163 1.489-5.405-.271-10.183-2.868-13.383-6.848-.562.96-.884 2.07-.884 3.259 0 2.254 1.14 4.24 2.873 5.417-.84-.026-1.621-.26-2.31-.641v.08c0 3.154 2.239 5.786 5.207 6.39-.544.148-1.114.225-1.702.225-.418 0-.823-.041-1.22-.116.829 2.572 3.224 4.463 6.077 4.567-2.226 1.748-5.034 2.793-8.09 2.793-1.056 0-2.09-.061-3.105-.18.859.92 1.867 1.745 2.994 2.406 3.429 2.31 7.502 3.665 11.908 3.665 14.269 0 22.07-11.16 22.07-20.834 0-.335-.01-.67-.026-1z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                {/* LinkedIn Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ContactForm;
