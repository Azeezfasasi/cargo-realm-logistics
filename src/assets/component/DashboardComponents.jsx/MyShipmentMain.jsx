import React, { useState, useContext } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { LuSearch, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { API_BASE_URL } from '@/config/Api';
// import { useProfile } from '../../context-api/UseProfile';
import { ProfileContext } from '@/assets/context-api/ProfileContext';

// Configure a new QueryClient
const queryClient = new QueryClient();

// In a real application, this would be retrieved from a state management
// system or local storage after the user logs in.
// const authToken = 'your-auth-token-here';

// Function to fetch shipments where the authenticated user is the sender.

// The main component for displaying the list of a user's shipments
function MyShipmentsMain() {
  const {token} = useContext(ProfileContext)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const shipmentsPerPage = 10;
  
const fetchMyShipments = async () => {
  if (!token) {
    throw new Error('Authentication token is missing.');
  }

  const response = await fetch(`${API_BASE_URL}/shipments/my-shipments`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch your shipments');
  }

  return response.json();
};


  // Fetch the user's shipments using useQuery
  const { data: shipments, isLoading, error } = useQuery({
    queryKey: ['my-shipments'],
    queryFn: fetchMyShipments,
    // The query will only run if a token is present, preventing unauthorized calls.
    enabled: !!token,
  });

  // Action button handlers (placeholders for future implementation)
  const handleEdit = (shipmentId) => console.log('Editing my shipment:', shipmentId);
  const handleReply = (shipmentId) => console.log('Replying to my shipment:', shipmentId);
  const handlePrint = (shipmentId) => console.log('Printing my shipment:', shipmentId);
  const handleGenerateInvoice = (shipmentId) => console.log('Generating invoice for my shipment:', shipmentId);
  const handleGenerateWaybill = (shipmentId) => console.log('Generating waybill for my shipment:', shipmentId);

  // Filter shipments based on search term
  const filteredShipments = shipments ? shipments.filter((shipment) =>
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Calculate pagination details
  const totalPages = Math.ceil(filteredShipments.length / shipmentsPerPage);
  const indexOfLastShipment = currentPage * shipmentsPerPage;
  const indexOfFirstShipment = indexOfLastShipment - shipmentsPerPage;
  const currentShipments = filteredShipments.slice(indexOfFirstShipment, indexOfLastShipment);

  // Handle pagination changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    return (
      <nav className="flex items-center justify-between">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LuChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <span className="text-sm font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
        </div>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LuChevronRight className="h-4 w-4" />
        </button>
      </nav>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6 bg-gray-100 min-h-screen">
        <div className="text-center text-xl font-medium text-gray-600">Loading your shipments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-6 bg-gray-100 min-h-screen">
        <div className="text-center text-red-500 font-medium">Error: {error.message}</div>
      </div>
    );
  }
  
  if (!shipments || shipments.length === 0) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">My Shipments</h2>
          <div className="text-center text-lg text-gray-500 p-8 bg-white rounded-xl shadow-xl">
            You have no shipments to display.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">My Shipments</h2>

        {/* Search Bar */}
        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search by Tracking #, Name, or Destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LuSearch className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Shipment Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Recipient Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Shipment Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentShipments.map((shipment) => (
                <tr key={shipment._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {shipment.trackingNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.recipientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize
                      ${shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        shipment.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                        shipment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.shipmentDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleEdit(shipment._id)} className="text-indigo-600 hover:text-indigo-900 transition-colors">Edit</button>
                      <button onClick={() => handleReply(shipment._id)} className="text-indigo-600 hover:text-indigo-900 transition-colors">Reply</button>
                      <button onClick={() => handlePrint(shipment._id)} className="text-gray-600 hover:text-gray-900 transition-colors">Print</button>
                      <button onClick={() => handleGenerateInvoice(shipment._id)} className="text-gray-600 hover:text-gray-900 transition-colors">Invoice</button>
                      <button onClick={() => handleGenerateWaybill(shipment._id)} className="text-gray-600 hover:text-gray-900 transition-colors">Waybill</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredShipments.length === 0 && (
            <div className="p-6 text-center text-gray-500">No shipments found.</div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center">
          {renderPaginationButtons()}
        </div>
      </div>
    </div>
  );
}

// The root component of the application, providing the QueryClientProvider
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyShipmentsMain />
    </QueryClientProvider>
  );
}

