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
              <p><strong>Shipment Items:</strong> {trackingResult.items.join(', ')}</p>
              <p><strong>Shipment Pieces:</strong> {trackingResult.shipmentPieces}</p>
              <p><strong>Shipment Type:</strong> {trackingResult.shipmentType}</p>
              <p><strong>Shipment Purpose:</strong> {trackingResult.shipmentPurpose}</p>
              <p><strong>Origin Country:</strong> {trackingResult.origin}</p>
              <p><strong>Destination Country:</strong> {trackingResult.destination}</p>
              <p><strong>Shipment Date:</strong> {formatDate(trackingResult.shipmentDate)}</p>
              <p><strong>Estimated Delivery:</strong> {formatDate(trackingResult.deliveryDate)}</p>
            </div>
          </div>
        )}

        {/* Shipment Tracking history */}
        {sortedHistory && (
          <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md font-sans mt-6 border border-solid border-green-400">
            <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 100-2A4 4 0 000 5v10a4 4 0 004 4h12a4 4 0 004-4V5a4 4 0 00-4-4 1 1 0 100 2 2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"></path>
              </svg>
              Tracking History for #{trackingResult.trackingNumber}
            </h2>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-8 bottom-0 w-1 bg-gradient-to-b from-green-400 to-gray-300"></div>
              
              {/* Timeline events */}
              <div className="space-y-6">
                {sortedHistory.map((event, index) => (
                  <div key={index} className="relative pl-20">
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-2 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                      index === 0 
                        ? 'bg-green-500 border-green-600 shadow-lg scale-110' 
                        : 'bg-blue-400 border-blue-500 hover:scale-110'
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        {index === 0 ? (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z"></path>
                        )}
                      </svg>
                    </div>
                    
                    {/* Event content */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 leading-tight capitalize text-lg mb-2">
                            {event.status}
                          </h4>
                          {event.location && (
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"></path>
                              </svg>
                              <p className="text-sm text-gray-700 font-medium">{event.location}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(event.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500 whitespace-nowrap font-medium">
                            {new Date(event.timestamp).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3 font-medium">Legend:</p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-green-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Latest Update</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z"></path>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Previous Updates</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


