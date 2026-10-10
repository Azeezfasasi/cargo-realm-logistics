import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import axios from 'axios';
import ShipmentTable from '../shipments/ShipmentTable';
import ShipmentToolbar from '../shipments/ShipmentToolbar';
import InProgressSummary from '../shipments/InProgressSummary';
import { isDelivered, daysSince, STALE_AFTER_DAYS, makeStatusCanonicalizer, makeStatusLabeler } from '../shipments/shipmentStatusStyles';
import { Plus, RotateCw, AlertTriangle, X, CheckSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useProfile } from '../../context-api/ProfileContext';

// PDF generation is heavy, so it's only downloaded when an invoice/waybill is opened
const ShipmentDocumentModal = lazy(() => import('../shipments/documents/ShipmentDocumentModal'));

const apiError = (err, fallback) => err?.response?.data?.message || err?.message || fallback;
import EditShipmentModal from '../shipments/EditShipmentModal';
import ReplyModal from '../shipments/ReplyModal';
import ChangeStatusModal from '../shipments/ChangeStatusModal';
import PrintModal from '../shipments/PrintModal';
import { exportToExcel } from '../../utils/exportToExcel';
import { API_BASE_URL } from '../../../config/Api';
import BasicModal from '@/components/ui/BasicModal';
import DeleteConfirmationModal from '../shipments/DeleteConfirmationModal';
import PaymentsModal from '../shipments/PaymentsModal';
import DocumentsModal from '../shipments/DocumentsModal';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AllShipmentsMain({ token }) {
  const { isAdmin, currentUser } = useProfile(); // only admins may delete (enforced by the backend too)
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [staleOnly, setStaleOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkStatusFilter, setBulkStatusFilter] = useState('');
  const [bulkLocation, setBulkLocation] = useState('');
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
        
        // Facility names; open-shipment counts are derived below
        setFacilities(facilitiesRes.data.map(f => ({ name: f.name })));
        
        // Set statuses
        setStatuses(statusesRes.data || []);
      } catch (err) {
        console.error('Error fetching facilities/statuses:', err);
      }
    };
    
    fetchFacilitiesAndStatuses();
  }, []);

  // Fetch once on mount; later calls (after edits) refresh in the background
  const fetchShipments = useCallback(async ({ background = false } = {}) => {
    if (background) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const authToken = token || localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/shipments`, authToken ? {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      } : undefined);
      const sorted = Array.isArray(res.data) ? res.data.sort((a, b) => getTimestamp(b) - getTimestamp(a)) : [];
      setShipments(sorted);
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to fetch shipments');
      if (!background) setShipments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const refreshShipments = () => fetchShipments({ background: true });

  // Match statuses by code or name, whichever the shipment was saved with
  const canonicalStatus = useMemo(() => makeStatusCanonicalizer(statuses), [statuses]);
  const statusLabel = useMemo(() => makeStatusLabeler(statuses), [statuses]);

  // Filters run locally on the fetched list (no refetch per keystroke)
  const filteredShipments = useMemo(() => {
    const wantedStatus = selectedStatus ? canonicalStatus(selectedStatus) : '';
    const q = searchQuery.trim().toLowerCase();
    return shipments.filter((s) => {
      const matchesStatus = !wantedStatus || canonicalStatus(s.status) === wantedStatus;
      const facilityName = (s.shipmentFacility || s.shipmentfacility || s.facility || '').toString();
      const matchesFacility = !selectedFacility || facilityName === selectedFacility;
      const matchesSearch = !q || [s.trackingNumber, s.senderName, s.recipientName, s.destination, s.status]
        .some((v) => v?.toLowerCase().includes(q));
      const matchesStale = !staleOnly || (!isDelivered(s.status) && daysSince(s.createdAt) > STALE_AFTER_DAYS);
      return matchesStatus && matchesFacility && matchesSearch && matchesStale;
    });
  }, [shipments, searchQuery, selectedStatus, selectedFacility, staleOnly, canonicalStatus]);

  // Facility dropdown shows how many open shipments each facility has
  const facilitiesWithCounts = useMemo(() => {
    const counts = {};
    shipments.forEach((s) => {
      if (isDelivered(s.status)) return;
      const name = (s.shipmentFacility || s.shipmentfacility || s.facility || '').toString().trim();
      if (name) counts[name] = (counts[name] || 0) + 1;
    });
    return facilities.map((f) => ({ ...f, count: counts[f.name] || 0 }));
  }, [shipments, facilities]);

  // Delivered shipments are hidden on this page, so don't offer them as a filter
  const openStatuses = useMemo(
    () => statuses.filter((st) => !isDelivered(st.code || st.name)),
    [statuses]
  );

  const handleSearch = (searchTerm) => setSearchQuery(searchTerm);
  const handleFilter = (status) => setSelectedStatus(status);
  const handleFacilityChange = (facility) => setSelectedFacility(facility);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSelectedFacility('');
    setStaleOnly(false);
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
      try {
        await axios.delete(`${API_BASE_URL}/shipments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Shipment deleted');
        refreshShipments();
      } catch (err) {
        console.error("Delete failed:", err.response?.data || err.message);
        toast.error(apiError(err, 'Failed to delete shipment'));
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
        toast.success('Message sent');
        refreshShipments();
    } catch (error) {
        console.error("Error sending reply:", error);
        toast.error(apiError(error, 'Failed to send message'));
    }
    };

    const handleStatusChange = async ({ shipmentId, newStatus, location, proofOfDelivery }) => {
        try {
            await axios.patch(`${API_BASE_URL}/shipments/${shipmentId}/status`, {
              status: newStatus,
              location: location,
              proofOfDelivery,
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            toast.success('Status updated');
            await refreshShipments();
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
        toast.error('Please select shipments and a status');
        return;
      }

      setBulkLoading(true);
      try {
        const authToken = token || localStorage.getItem('token');
        // allSettled so one failure doesn't hide which updates succeeded
        const results = await Promise.allSettled(
          selectedShipments.map(shipmentId =>
            axios.patch(`${API_BASE_URL}/shipments/${shipmentId}/status`, { status: bulkStatusFilter, location: bulkLocation.trim() || undefined }, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            })
          )
        );
        const failedIds = selectedShipments.filter((_, i) => results[i].status === 'rejected');
        const okCount = selectedShipments.length - failedIds.length;

        if (failedIds.length === 0) {
          toast.success(`Updated ${okCount} shipment(s)`);
        } else {
          const firstError = results.find((r) => r.status === 'rejected').reason;
          console.error("Bulk status update failures", results);
          toast.error(`${failedIds.length} of ${selectedShipments.length} failed: ${apiError(firstError, 'update failed')}`);
        }
        // Keep failed ones selected so they can be retried
        setSelectedShipments(failedIds);
        if (failedIds.length === 0) {
          setBulkModalOpen(false);
          setBulkStatusFilter('');
          setBulkLocation('');
        }
        refreshShipments();
      } finally {
        setBulkLoading(false);
      }
    };

    const clearSelection = () => {
      setSelectedShipments([]);
    };
    
    
  if (loading) {
    return (
      <div className="space-y-6 p-4 lg:p-6">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
        <div className="h-16 animate-pulse rounded-2xl bg-gray-100" />
        <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-50">
          <FaSpinner className="animate-spin text-3xl text-green-600" />
          <p className="ml-3 text-sm text-gray-600">Loading shipments…</p>
        </div>
      </div>
    );
  }

  if (error && shipments.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertTriangle size={26} />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Couldn&apos;t load shipments</h2>
          <p className="mt-1 text-sm text-gray-500">{String(error)}</p>
          <button
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
            onClick={() => fetchShipments()}
          >
            <RotateCw size={15} /> Try again
          </button>
        </div>
      </div>
    );
  }

  const openShipments = filteredShipments.filter((s) => !isDelivered(s.status));

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Shipments</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">All Shipments</h1>
          <p className="mt-1 text-sm text-gray-500">Track every shipment that is still on its way to the receiver.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshShipments}
            disabled={refreshing}
            title="Refresh"
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            <RotateCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{refreshing ? 'Refreshing…' : 'Refresh'}</span>
          </button>
          <Link
            to="/app/account/createshipment"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white shadow-sm shadow-green-900/20 transition-all hover:bg-green-700 hover:shadow-md"
          >
            <Plus size={16} /> Create Shipment
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertTriangle size={16} /> Refresh failed: {String(error)}
        </div>
      )}

      {/* In-progress overview */}
      <InProgressSummary
        shipments={shipments}
        selectedStatus={selectedStatus ? canonicalStatus(selectedStatus) : ''}
        onStatusSelect={handleFilter}
        canonicalStatus={canonicalStatus}
        statusLabel={statusLabel}
        staleOnly={staleOnly}
        onToggleStale={() => setStaleOnly((v) => !v)}
      />

      {/* Toolbar and Filters */}
      <ShipmentToolbar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onStatusChange={handleFilter}
        onFacilityChange={handleFacilityChange}
        selectedFacility={selectedFacility}
        selectedStatus={selectedStatus}
        facilities={facilitiesWithCounts}
        statuses={openStatuses}
        onClearFilters={clearFilters}
        onExport={() => exportToExcel(openShipments, 'In_Progress_Shipments')}
      />

      {staleOnly && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} />
            Showing shipments open for more than {STALE_AFTER_DAYS} days
          </span>
          <button
            type="button"
            onClick={() => setStaleOnly(false)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold hover:bg-amber-100"
          >
            <X size={13} /> Show all
          </button>
        </div>
      )}

      {/* Bulk Action Toolbar */}
      {selectedShipments.length > 0 && (
        <div className="sticky top-2 z-10 flex flex-col items-center justify-between gap-3 rounded-2xl border border-green-200 bg-white/95 p-3 pl-4 shadow-lg shadow-green-900/5 backdrop-blur md:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <CheckSquare size={18} />
            </span>
            <div className="text-sm text-gray-700">
              <span className="font-bold text-gray-900">{selectedShipments.length}</span> shipment(s) selected
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
            <select
              value={bulkStatusFilter}
              onChange={(e) => setBulkStatusFilter(e.target.value)}
              className="h-10 flex-1 cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 md:w-60 md:flex-none"
            >
              <option value="">Select status to apply…</option>
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
            <input
              type="text"
              value={bulkLocation}
              onChange={(e) => setBulkLocation(e.target.value)}
              placeholder="Location (optional)"
              className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 md:w-48 md:flex-none"
            />
            <button
              onClick={() => setBulkModalOpen(true)}
              disabled={!bulkStatusFilter}
              className="h-10 cursor-pointer rounded-xl bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Update Status
            </button>
            <button
              onClick={clearSelection}
              className="h-10 cursor-pointer rounded-xl px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
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
        canDelete={isAdmin}
        selectedShipments={selectedShipments}
        onSelectShipment={handleSelectShipment}
        onSelectAll={handleSelectAll}
      />

       {/* Bulk Status Update Confirmation Modal */}
        <BasicModal isOpen={bulkModalOpen} onClose={() => setBulkModalOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Bulk Status Update</h3>
            <p className="text-gray-600 mb-6">
              You are about to update the status of <span className="font-bold text-green-600">{selectedShipments.length}</span> shipment(s) to <span className="font-bold">{bulkStatusFilter}</span>{bulkLocation.trim() ? <> at <span className="font-bold">{bulkLocation.trim()}</span></> : null}.
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
                onUpdate={refreshShipments}
                facilities={facilitiesWithCounts}
                onSave={async (updatedShipment) => {
                try {
                    await axios.put(`${API_BASE_URL}/shipments/${updatedShipment._id}`, updatedShipment, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    });
                    toast.success('Shipment updated');
                    refreshShipments(); // Refresh data
                } catch (error) {
                    console.error('Failed to update shipment:', error);
                    toast.error(apiError(error, 'Failed to update shipment'));
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

        {selectedShipment && modalType === 'documents' && (
        <BasicModal isOpen onClose={closeModal}>
            <DocumentsModal
                shipment={selectedShipment}
                token={token}
                isAdmin={isAdmin}
                currentUserId={currentUser?._id}
                onUpdated={(updated) => setShipments((prev) => prev.map((s) => (s._id === updated._id ? { ...s, ...updated } : s)))}
                onClose={closeModal}
            />
        </BasicModal>
        )}

        {selectedShipment && modalType === 'payments' && (
        <BasicModal isOpen onClose={closeModal}>
            <PaymentsModal
                shipment={selectedShipment}
                token={token}
                isAdmin={isAdmin}
                onUpdated={(updated) => setShipments((prev) => prev.map((s) => (s._id === updated._id ? { ...s, ...updated } : s)))}
                onClose={closeModal}
            />
        </BasicModal>
        )}

        {selectedShipment && (modalType === 'invoice' || modalType === 'waybill') && (
        <BasicModal isOpen onClose={closeModal}>
            <Suspense fallback={<div className="flex h-40 items-center justify-center"><FaSpinner className="animate-spin text-2xl text-green-600" /></div>}>
                <ShipmentDocumentModal shipment={selectedShipment} type={modalType} onClose={closeModal} />
            </Suspense>
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

