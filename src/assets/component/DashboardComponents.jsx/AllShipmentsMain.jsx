import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ShipmentTable from '../shipments/ShipmentTable';
import ShipmentToolbar from '../shipments/ShipmentToolbar';
import EditShipmentModal from '../shipments/EditShipmentModal';
import ReplyModal from '../shipments/ReplyModal';
import ChangeStatusModal from '../shipments/ChangeStatusModal';
import PrintModal from '../shipments/PrintModal';
import { exportToExcel } from '../../utils/exportToExcel';
import { API_BASE_URL } from '../../../config/Api';
import BasicModal from '@/components/ui/BasicModal';
import DeleteConfirmationModal from '../shipments/DeleteConfirmationModal';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AllShipmentsMain({ token }) {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkStatusFilter, setBulkStatusFilter] = useState('');
   const [bulkLoading, setBulkLoading] = useState(false);

  const getTimestamp = (item) => {
  return new Date(
    item.createdAt ||
    item.shipmentDate ||
    item.timestamp ||
    item.dateCreated ||
    item.updatedAt || // fallback
    0 // default if none found
  );
};

  // Fetch facilities and statuses on mount
  useEffect(() => {
    const fetchFacilitiesAndStatuses = async () => {
      try {
        const [facilitiesRes, statusesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/facilities`),
          axios.get(`${API_BASE_URL}/shipment-statuses`)
        ]);
        
        // Transform facilities for display
        const facilityList = facilitiesRes.data.map(f => ({
          name: f.name,
          count: 0 // Will be calculated from shipments
        }));
        setFacilities(facilityList);
        
        // Set statuses
        setStatuses(statusesRes.data || []);
      } catch (err) {
        console.error('Error fetching facilities/statuses:', err);
      }
    };
    
    fetchFacilitiesAndStatuses();
  }, []);

  // Centralized filter application (pure function - no hook deps)
  const applyFilters = ({ shipmentsList, status, facility, term } = {}) => {
    const list = Array.isArray(shipmentsList) ? shipmentsList : [];
    const q = (term || '').toLowerCase();
    return list.filter((s) => {
      const matchesStatus = !status || s.status === status;
      const facilityName = (s.shipmentFacility || s.shipmentfacility || s.facility || '').toString();
      const matchesFacility = !facility || facilityName === facility;
      const matchesSearch = !q || (
        s.trackingNumber?.toLowerCase().includes(q) ||
        s.senderName?.toLowerCase().includes(q) ||
        s.destination?.toLowerCase().includes(q) ||
        s.status?.toLowerCase().includes(q)
      );
      return matchesStatus && matchesFacility && matchesSearch;
    });
  };

  const fetchShipments = useCallback(async () => {
    setLoading(true); // Start loading
    setError(null);
    try {
      const authToken = token || localStorage.getItem('token');
      console.log('AllShipmentsMain: fetching shipments, token present?', !!authToken);
      const res = await axios.get(`${API_BASE_URL}/shipments`, authToken ? {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      } : undefined);
      console.log('AllShipmentsMain: fetch response status', res.status);
      const sorted = Array.isArray(res.data) ? res.data.sort((a, b) => getTimestamp(b) - getTimestamp(a)) : [];
      console.log('AllShipmentsMain: fetched shipments count', sorted.length);
      setShipments(sorted);
      // apply current filters to freshly fetched data using current UI state
      const applied = applyFilters({ shipmentsList: sorted, status: selectedStatus, facility: selectedFacility, term: searchQuery });
      setFilteredShipments(applied);
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to fetch shipments');
      setShipments([]);
      setFilteredShipments([]);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [token, selectedStatus, selectedFacility, searchQuery]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Compute facility counts from shipments
  useEffect(() => {
    if (facilities.length === 0) return;
    
    const facilityCounts = {};
    shipments.forEach((s) => {
      const raw = (s.shipmentFacility || s.shipmentfacility || s.facility || '').toString();
      const name = raw.trim();
      if (!name) return;
      facilityCounts[name] = (facilityCounts[name] || 0) + 1;
    });
    
    // Create list with counts
    const facilityList = facilities.map(f => ({
      ...f,
      count: facilityCounts[f.name] || 0
    }));
    setFacilities(facilityList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipments]);

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
    const applied = applyFilters({ term: searchTerm });
    setFilteredShipments(applied);
  };


  const handleFilter = (status) => {
    setSelectedStatus(status);
    const applied = applyFilters({ status });
    setFilteredShipments(applied);
  };

  const handleFacilityChange = (facility) => {
    setSelectedFacility(facility);
    const applied = applyFilters({ facility });
    setFilteredShipments(applied);
  };

  const openModal = (shipment, type) => {
    setSelectedShipment(shipment);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedShipment(null);
    setModalType(null);
  };

    const handleDeleteShipment = async (id) => {
    console.log("Trying to delete shipment:", id);
      try {
        const res = await axios.delete(`${API_BASE_URL}/shipments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Delete success:", res.data);
        fetchShipments();
      } catch (err) {
        console.error("Delete failed:", err.response?.data || err.message);
      }
    };

    const handleSendReply = async ({ shipmentId, message }) => {
    try {
        const token = localStorage.getItem("token");
        await axios.post(`${API_BASE_URL}/shipments/${shipmentId}/reply`, 
        { message },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );
        // Optionally show a toast or refetch shipment notes/messages
        console.log("Reply sent successfully");
    } catch (error) {
        console.error("Error sending reply:", error);
    }
    };

    const handleStatusChange = async ({ shipmentId, newStatus, location }) => {
        try {
            await axios.patch(`${API_BASE_URL}/shipments/${shipmentId}/status`, { 
              status: newStatus,
              location: location
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            await fetchShipments(); 
        } catch (err) {
            console.error("Failed to update status", err);
            throw new Error(err?.response?.data?.message || 'Failed to update status. Please try again.');
        }
    };

    // const handleRegenerateQRCode = async (shipmentId) => {
    //     try {
    //         const authToken = token || localStorage.getItem('token');
    //         const res = await axios.post(`${API_BASE_URL}/shipments/${shipmentId}/regenerate-qr`, {}, {
    //             headers: {
    //                 Authorization: `Bearer ${authToken}`,
    //             },
    //         });
    //         console.log("QR code regenerated successfully:", res.data);
    //         alert('QR code regenerated successfully!');
    //         fetchShipments(); // Refresh data
    //         closeModal();
    //     } catch (err) {
    //         console.error("Failed to regenerate QR code:", err);
    //         alert(`Error: ${err.response?.data?.message || err.message}`);
    //     }
    // };

    // Bulk action handlers
    const handleSelectShipment = (shipmentId, isChecked) => {
      setSelectedShipments(prev => 
        isChecked 
          ? [...prev, shipmentId]
          : prev.filter(id => id !== shipmentId)
      );
    };

    const handleSelectAll = (isChecked, shipmentIds) => {
      if (isChecked) {
        setSelectedShipments(prev => {
          const newIds = shipmentIds.filter(id => !prev.includes(id));
          return [...prev, ...newIds];
        });
      } else {
        setSelectedShipments(prev => 
          prev.filter(id => !shipmentIds.includes(id))
        );
      }
    };

    const handleBulkStatusChange = async () => {
      if (selectedShipments.length === 0 || !bulkStatusFilter) {
        alert('Please select shipments and a status');
        return;
      }

      setBulkLoading(true);
      try {
        const authToken = token || localStorage.getItem('token');
        await Promise.all(
          selectedShipments.map(shipmentId =>
            axios.patch(`${API_BASE_URL}/shipments/${shipmentId}/status`, { status: bulkStatusFilter }, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            })
          )
        );
        alert(`Successfully updated ${selectedShipments.length} shipment(s)`);
        setSelectedShipments([]);
        setBulkModalOpen(false);
        setBulkStatusFilter('');
        fetchShipments();
      } catch (err) {
        console.error("Failed to bulk update status", err);
        alert(`Error: ${err.response?.data?.message || err.message}`);
        } finally {
        setBulkLoading(false);
      }
    };

    const clearSelection = () => {
      setSelectedShipments([]);
    };
    
    
    if (loading) { 
        return (
          <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex items-center justify-center min-h-[calc(100vh-120px)]">
            <FaSpinner className="animate-spin text-green-600 text-4xl" />
            <p className="ml-3 text-lg text-gray-700">Loading all shipments...</p>
          </section>
        );
      }

  if (error) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        <p className="text-red-600 mb-4">Error loading shipments: {String(error)}</p>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => fetchShipments()}
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* <div className='font-bold text-[20px] lg:text-[28px]'>All Shipments</div> */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between">
        <div>
          <h1 className='font-bold text-3xl lg:text-4xl text-gray-900'>All Shipments</h1>
          <p className="text-gray-600 text-sm mt-1">Manage and track your logistics shipments</p>
        </div>
        <div className="flex items-center gap-4">
          {/* add link to create shipment */}
          <Link to="/app/account/createshipment" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium">
            + Create Shipment
          </Link>
        </div>
      </div>
      {/* Toolbar and Filters */}
      <ShipmentToolbar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onStatusChange={handleFilter}
        onFacilityChange={handleFacilityChange}
        selectedFacility={selectedFacility}
        selectedStatus={selectedStatus}
        facilities={facilities}
        statuses={statuses}
        onExport={() => exportToExcel(filteredShipments, 'All_Shipments')}
      />

      {/* Bulk Action Toolbar */}
      {selectedShipments.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-gray-700">
              <span className="font-bold text-green-600">{selectedShipments.length}</span> shipment(s) selected
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={bulkStatusFilter}
              onChange={(e) => setBulkStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option value="">Select status to apply...</option>
              {Array.isArray(statuses) && statuses.length > 0 ? (
                statuses.map((status) => (
                  status.isActive && (
                    <option key={status._id} value={status.code || status.name.toLowerCase()}>
                      {status.name}
                    </option>
                  )
                ))
              ) : (
                <>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="in-transit">In Transit</option>
                  <option value="out-for-delivery">Out For Delivery</option>
                  <option value="delivered">Delivered</option>
                </>
              )}
            </select>
            <button
              onClick={() => setBulkModalOpen(true)}
              disabled={!bulkStatusFilter}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              Update Status
            </button>
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <ShipmentTable
        shipments={filteredShipments}
        onActionClick={openModal}
        onDeleteClick={(shipment) => openModal(shipment, 'delete')}
        selectedShipments={selectedShipments}
        onSelectShipment={handleSelectShipment}
        onSelectAll={handleSelectAll}
      />

       {/* Bulk Status Update Confirmation Modal */}
        <BasicModal isOpen={bulkModalOpen} onClose={() => setBulkModalOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Bulk Status Update</h3>
            <p className="text-gray-600 mb-6">
              You are about to update the status of <span className="font-bold text-green-600">{selectedShipments.length}</span> shipment(s) to <span className="font-bold">{bulkStatusFilter}</span>.
            </p>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setBulkModalOpen(false)}
                disabled={bulkLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkStatusChange}
                disabled={bulkLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {bulkLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </div>
        </BasicModal>

        {/* Modals */}
        {selectedShipment && (
          <BasicModal isOpen={modalType === 'delete'} onClose={closeModal}>
            <DeleteConfirmationModal
              isOpen={modalType === 'delete'}
              shipment={selectedShipment}
              onClose={closeModal}
              onConfirm={handleDeleteShipment}
            />
          </BasicModal>
        )}

        {selectedShipment && (
        <BasicModal isOpen={modalType === 'edit'} onClose={closeModal}>
            <EditShipmentModal
                shipment={selectedShipment}
                onClose={closeModal}
                onUpdate={fetchShipments}
                facilities={facilities}
                onSave={async (updatedShipment) => {
                try {
                    await axios.put(`${API_BASE_URL}/shipments/${updatedShipment._id}`, updatedShipment, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    });
                    fetchShipments(); // Refresh data
                } catch (error) {
                    console.error('Failed to update shipment:', error);
                }
                }}
            />
        </BasicModal>
        )}

        {selectedShipment && (
        <BasicModal isOpen={modalType === 'reply'} onClose={closeModal}>
            <ReplyModal
            shipment={selectedShipment}
            onSendReply={handleSendReply}
            onClose={closeModal}
            />
        </BasicModal>
        )}

        {selectedShipment && (
        <BasicModal isOpen={modalType === 'status'} onClose={closeModal}>
          <ChangeStatusModal
          shipment={selectedShipment}
          onClose={() => closeModal(false)}
          onStatusChange={handleStatusChange}
          statuses={statuses}
          />
        </BasicModal>
        )}

        {selectedShipment && (
        <BasicModal isOpen={modalType === 'print'} onClose={closeModal}>
            <PrintModal shipment={selectedShipment} onClose={closeModal} />
        </BasicModal>
        )}

        {selectedShipment && (
        <BasicModal isOpen={modalType === 'qr'} onClose={closeModal}>
            <div className="bg-white rounded-lg p-6 w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-green-900">QR Code</h3>
                    <button
                        onClick={closeModal}
                        className="text-red-600 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>
                
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Tracking Number: <strong>{selectedShipment.trackingNumber}</strong></p>
                    {selectedShipment.qrCodeUrl && (
                        <div className="flex justify-center mb-4">
                            <img src={selectedShipment.qrCodeUrl} alt="QR Code" className="w-48 h-48 border border-gray-300 rounded" />
                        </div>
                    )}
                </div>

                {/* <button
                    onClick={() => handleRegenerateQRCode(selectedShipment._id)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mb-2"
                >
                    Regenerate QR Code
                </button> */}

                {selectedShipment.qrCodeUrl && (
                    <a
                        href={selectedShipment.qrCodeUrl}
                        download={`QR-${selectedShipment.trackingNumber}.png`}
                        className="w-full block text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        Download QR Code
                    </a>
                )}
            </div>
        </BasicModal>
        )}
    </div>
  );
}

