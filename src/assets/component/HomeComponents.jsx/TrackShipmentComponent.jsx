import React, { useState } from 'react';
import { API_BASE_URL } from '@/config/Api';

export default function TrackShipmentComponent() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleTrackingChange = (e) => {
    setTrackingNumber(e.target.value);
    // Clear previous results/errors when input changes
    setTrackingResult(null);
    setError(null);
  };

  const handleTrackShipment = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTrackingResult(null);

    // Make an API call to the backend tracking endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/track/${trackingNumber}`);
      
      // Check if the response is successful
      if (!response.ok) {
        // Parse the error message from the backend if available
        const errorData = await response.json();
        throw new Error(errorData.message || 'Tracking number not found.');
      }

      const data = await response.json();
      setTrackingResult(data);

    } catch (err) {
      console.error('Tracking error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format the date
  const formatDate = (dateString) => {
    // Return null or a placeholder if the dateString is invalid
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    // Use `toLocaleDateString` with options for the desired format
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Only render the tracking history if trackingResult exists and has trackingHistory
  let sortedHistory = null;
  if (trackingResult && trackingResult.trackingHistory) {
    sortedHistory = [...trackingResult.trackingHistory].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  return (
    <section className="bg-gray-50 py-16 px-4 font-sans">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Track Your <span className="text-green-600">Shipment</span>
        </h2>
        <p className="text-gray-700 text-lg mb-10 max-w-2xl mx-auto">
          Enter your tracking number below to get real-time updates on your cargo's journey.
        </p>

        <form onSubmit={handleTrackShipment} className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
          <input
            type="text"
            placeholder="Enter Tracking Number E.g: Car65648631970"
            value={trackingNumber}
            onChange={handleTrackingChange}
            className="w-full md:w-1/2 lg:w-1/3 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
            aria-label="Tracking Number"
            required
          />
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            )}
            {isLoading ? 'Tracking...' : 'Track Shipment'}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative max-w-md mx-auto" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {trackingResult && (
          <div className="bg-white px-6 py-6 md:px-8 md:py-8 rounded-lg border border-solid border-green-400 shadow-xl max-w-3xl mx-auto text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Shipment Status: <br className='md:hidden' /> <span className={`font-extrabold capitalize ${trackingResult.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>{trackingResult.status}</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
              <p><strong>Sender Name:</strong> {trackingResult.senderName}</p>
              <p><strong>Receiver Name:</strong> {trackingResult.recipientName}</p>
              <p><strong>Origin Country:</strong> {trackingResult.origin}</p>
              <p><strong>Destination Country:</strong> {trackingResult.destination}</p>
              <p><strong>Shipment Date:</strong> {formatDate(trackingResult.shipmentDate)}</p>
              <p><strong>Estimated Delivery:</strong> {formatDate(trackingResult.deliveryDate)}</p>
            </div>
          </div>
        )}

        {/* Shipment Tracking history */}
        {sortedHistory && (
          <div className="max-w-[500px] mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md font-sans mt-3 border border-solid border-green-400">
            <h2 className="text-[18px] sm:text-[18px] font-bold text-green-700 mb-6">Shipment Tracking History for #{trackingResult.trackingNumber}</h2>
            <div className="relative border-l-2 border-gray-200 ml-2">
              {sortedHistory.map((event, index) => (
                <div key={index} className="mb-8 ml-6 relative">
                  {/* The dot */}
                  <div className={`absolute -left-8 top-1.5 w-4 h-4 rounded-full border-2 ${index === 0 ? 'bg-green-600 border-green-600' : 'bg-blue-400 border-gray-400'}`}></div>
                  
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-gray-900 leading-tight mb-1 capitalize">{event.status}</h4>
                    <p className="text-sm text-gray-600 mb-1">{event.location}</p>
                    <p className="text-xs text-gray-400">{new Date(event.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
