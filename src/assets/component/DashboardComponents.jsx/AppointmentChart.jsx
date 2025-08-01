import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/Api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaSpinner, FaTimesCircle, FaChartPie } from 'react-icons/fa';

// Define colors for different appointment statuses
const COLORS = {
  'pending': '#FFBB28', // Yellow/Orange
  'confirmed': '#00C49F', // Green
  'completed': '#8884d8', // Purple/Blue
  'cancelled': '#FF8042', // Orange/Red
  'rescheduled': '#0088FE', // Blue
  // Add more statuses and their colors if needed
};

// Custom tooltip content for the pie chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-md shadow-lg">
        <p className="font-semibold text-gray-800">{`${data.name}: ${data.value} appointments`}</p>
        <p className="text-gray-600 text-sm">{`Percentage: ${(data.percent * 100).toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const AppointmentStatusChart = () => {
  // Helper function to fetch data with auth token
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in.');
    }
    const response = await axios.get(`${API_BASE_URL}/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }, []);

  // Use useQuery to fetch all appointments
  const { 
    data: appointments, 
    isLoading, 
    isError, 
    error,
    refetch // Allows manual refetching
  } = useQuery({
    queryKey: ['appointmentsChartData'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
  });

  // Process data for the pie chart
  const processedData = React.useMemo(() => {
    if (!appointments || appointments.length === 0) {
      return [];
    }

    // Group appointments by status and count them
    const statusCounts = appointments.reduce((acc, appointment) => {
      const status = appointment.status || 'unknown'; // Default to 'unknown' if status is missing
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Convert counts into recharts compatible format
    return Object.keys(statusCounts).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize first letter
      value: statusCounts[status],
    }));
  }, [appointments]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex items-center justify-center min-h-[calc(100vh-120px)]">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
        <p className="ml-3 text-lg text-gray-700">Loading appointment data...</p>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-red-600">
        <FaTimesCircle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">Error loading appointments!</p>
        <p className="text-lg text-center">{error?.message || 'Something went wrong while fetching appointment data.'}</p>
        <button
          onClick={() => refetch()}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
        >
          Retry
        </button>
      </section>
    );
  }

  // No data found state
  if (!processedData || processedData.length === 0) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-gray-600">
        <FaChartPie className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-xl font-semibold">No appointment data available.</p>
        <p className="text-lg text-center mt-2">There are no appointments to display in the chart.</p>
      </section>
    );
  }

  return (
    <>
      <section className="py-0 sm:py-0 bg-gray-50 font-inter antialiased mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
              Appointment Status Distribution
            </h2>
            <p className="text-lg text-gray-600 text-center mb-0">
              Overview of your appointments by their current status.
            </p>

            <div className="w-full h-80 sm:h-96"> {/* Responsive container for the chart */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100} // Adjust size as needed
                    fill="#8884d8"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Label with name and percentage
                  >
                    {processedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()] || '#CCCCCC'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppointmentStatusChart;
