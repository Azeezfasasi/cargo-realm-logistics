import React, { useState } from 'react';

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

    // Simulate an API call for tracking
    try {
      // In a real application, you would make a fetch call to your backend
      // const response = await fetch(`/api/track?number=${trackingNumber}`);
      // const data = await response.json();

      // Placeholder for simulated tracking data
      setTimeout(() => {
        if (trackingNumber === '123456789') {
          setTrackingResult({
            status: 'In Transit',
            currentLocation: 'Lagos, Nigeria',
            lastUpdate: '2025-07-29 14:30 WAT',
            estimatedDelivery: '2025-08-05',
            details: [
              { date: '2025-07-27', time: '10:00', location: 'Origin Warehouse', activity: 'Shipment received' },
              { date: '2025-07-27', time: '18:00', location: 'Departure Port', activity: 'Departed from origin' },
              { date: '2025-07-29', time: '14:30', location: 'In Transit', activity: 'En route to destination' },
            ],
          });
        } else if (trackingNumber === '987654321') {
          setTrackingResult({
            status: 'Delivered',
            currentLocation: 'Accra, Ghana',
            lastUpdate: '2025-07-25 11:00 WAT',
            estimatedDelivery: '2025-07-25',
            details: [
              { date: '2025-07-20', time: '09:00', location: 'Origin Warehouse', activity: 'Shipment received' },
              { date: '2025-07-21', time: '16:00', location: 'Departure Port', activity: 'Departed from origin' },
              { date: '2025-07-24', time: '08:00', location: 'Arrival Port', activity: 'Arrived at destination port' },
              { date: '2025-07-25', time: '11:00', location: 'Accra, Ghana', activity: 'Delivered to recipient' },
            ],
          });
        } else {
          setError('Tracking number not found. Please try again.');
        }
        setIsLoading(false);
      }, 1500); // Simulate network delay
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to fetch tracking information. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 py-16 px-4 font-sans">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Track Your <span className="text-green-600">Shipment</span>
        </h2>
        <p className="text-gray-700 text-lg mb-10 max-w-2xl mx-auto">
            Enter your tracking number below to get real-time updates on your {`cargo's`} journey.
        </p>

        <form onSubmit={handleTrackShipment} className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
          <input
            type="text"
            placeholder="Enter Tracking Number E.g: 123456789"
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
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative max-w-md mx-auto" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {trackingResult && (
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl mx-auto text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Shipment Status: <span className={`font-extrabold ${trackingResult.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>{trackingResult.status}</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
              <p><strong>Current Location:</strong> {trackingResult.currentLocation}</p>
              <p><strong>Last Updated:</strong> {trackingResult.lastUpdate}</p>
              <p><strong>Estimated Delivery:</strong> {trackingResult.estimatedDelivery}</p>
            </div>

            <h4 className="text-xl font-bold text-gray-900 mb-4">Tracking History</h4>
            <div className="space-y-4">
              {trackingResult.details.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex-shrink-0"></div>
                    {index < trackingResult.details.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 mt-1 flex-grow"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{event.activity}</p>
                    <p className="text-sm text-gray-600">{event.date} {event.time} - {event.location}</p>
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
