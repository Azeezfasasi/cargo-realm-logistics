import React, { useState } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function SMSLogs() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    eventType: '',
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  // Fetch SMS logs
  const { data: logsData, isLoading } = useQuery({
    queryKey: ['smsLogs', filters],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/sms/logs`, {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  // Delete log mutation
  const deleteMutation = useMutation({
    mutationFn: async (logId) => {
      await axios.delete(`${API_BASE_URL}/sms/logs/${logId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success('SMS log deleted');
      queryClient.invalidateQueries({ queryKey: ['smsLogs'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete log');
    },
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select
              value={filters.eventType}
              onChange={(e) => setFilters({ ...filters, eventType: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Events</option>
              <option value="SHIPMENT_CREATED_SENDER">Creation - Sender</option>
              <option value="SHIPMENT_CREATED_RECIPIENT">Creation - Recipient</option>
              <option value="SHIPMENT_STATUS_UPDATED">Status Updated</option>
              <option value="SHIPMENT_DELIVERED">Delivered</option>
              <option value="SHIPMENT_CANCELLED">Cancelled</option>
              <option value="SHIPMENT_EXCEPTION">Exception</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Results per Page</label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value), page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* SMS Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Event Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Recipient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Sent At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Loading SMS logs...
                </td>
              </tr>
            ) : logsData?.logs?.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No SMS logs found
                </td>
              </tr>
            ) : (
              logsData?.logs?.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{log.phoneNumber}</td>
                  <td className="px-6 py-4 text-sm">{log.eventType}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.recipientType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(log.sentAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(log._id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {logsData?.pagination && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Page {logsData.pagination.page} of {logsData.pagination.pages} (Total: {logsData.pagination.total})
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                disabled={filters.page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:text-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    page: Math.min(logsData.pagination.pages, filters.page + 1),
                  })
                }
                disabled={filters.page === logsData.pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:text-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="font-semibold text-lg mb-4">SMS Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Phone:</span> {selectedLog.phoneNumber}
              </div>
              <div>
                <span className="font-medium">Message:</span>
                <p className="text-gray-600 mt-1">{selectedLog.message}</p>
              </div>
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(selectedLog.status)}`}>
                  {selectedLog.status}
                </span>
              </div>
              <div>
                <span className="font-medium">Event Type:</span> {selectedLog.eventType}
              </div>
              <div>
                <span className="font-medium">Sent At:</span>{' '}
                {new Date(selectedLog.sentAt).toLocaleString()}
              </div>
              {selectedLog.trackingNumber && (
                <div>
                  <span className="font-medium">Tracking #:</span> {selectedLog.trackingNumber}
                </div>
              )}
              {selectedLog.error && (
                <div>
                  <span className="font-medium text-red-600">Error:</span> {selectedLog.error}
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
