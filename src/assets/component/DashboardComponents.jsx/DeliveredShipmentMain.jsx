import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import axios from 'axios';
import ShipmentToolbar from '../shipments/ShipmentToolbar';
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
import DeliveredShipmentTable from '../shipments/DeliveredShipmentTable';
import { toast } from 'react-hot-toast';
import { useProfile } from '../../context-api/ProfileContext';

// PDF generation is heavy, so it's only downloaded when an invoice/waybill is opened
const ShipmentDocumentModal = lazy(() => import('../shipments/documents/ShipmentDocumentModal'));

const apiError = (err, fallback) => err?.response?.data?.message || err?.message || fallback;
const PAGE_SIZE = 10;

export default function DeliveredShipmentsMain({ token }) {
  const { isAdmin, currentUser } = useProfile(); // only admins may delete (enforced by the backend too)
  // One page of delivered shipments from the server (this list only grows, so it's paged there)
  const [shipments, setShipments] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1, total: 0, limit: PAGE_SIZE });
  const [page, setPage] = useState(1);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [facilities, setFacilities] = useState([]);

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token || localStorage.getItem('token')}` }), [token]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/facilities`)
      .then((res) => setFacilities(res.data.map((f) => ({ name: f.name }))))
      .catch((err) => console.error('Error fetching facilities:', err));
  }, []);

  // Wait for a pause in typing before searching on the server
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Any filter change goes back to page 1
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedFacility]);

  const listParams = useMemo(() => ({
    view: 'delivered',
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedFacility ? { facility: selectedFacility } : {}),
  }), [debouncedSearch, selectedFacility]);

  // First load shows the spinner; later loads (paging, filters, after edits) refresh in place
  const fetchShipments = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/shipments`, {
        headers: authHeaders,
        params: { ...listParams, page, limit: PAGE_SIZE },
      });
      setShipments(res.data.items || []);
      setPageInfo({ page: res.data.page, pages: res.data.pages, total: res.data.total, limit: res.data.limit });
      if (res.data.page !== page) setPage(res.data.page); // e.g. the last page emptied by a delete
      setHasLoaded(true);
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to fetch shipments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authHeaders, listParams, page]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Export every delivered shipment matching the filters, not just this page
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/shipments`, {
        headers: authHeaders,
        params: { ...listParams, page: 1, limit: 'all' },
      });
      exportToExcel(res.data.items || [], 'Delivered_Shipments');
    } catch (err) {
      toast.error(apiError(err, 'Export failed'));
    } finally {
      setExporting(false);
    }
  };

  const handleSearch = (searchTerm) => setSearchQuery(searchTerm);
  const handleFacilityChange = (facility) => setSelectedFacility(facility);
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedFacility('');
  };

  // Replace one shipment in the current page (payments/documents update in place)
  const mergeShipment = (updated) =>
    setShipments((list) => list.map((s) => (s._id === updated._id ? { ...s, ...updated } : s)));

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
        fetchShipments();
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
        fetchShipments();
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
            await fetchShipments();
        } catch (err) {
            console.error("Failed to update status", err);
            // Rethrow so ChangeStatusModal shows the error instead of closing as if it worked
            throw new Error(apiError(err, 'Failed to update status. Please try again.'));
        }
    };
    
    if (loading) { 
        return (
          <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex items-center justify-center min-h-[calc(100vh-120px)]">
            <FaSpinner className="animate-spin text-green-600 text-4xl" />
            <p className="ml-3 text-lg text-gray-700">Loading all shipments...</p>
          </section>
        );
      }

  if (error && !hasLoaded) {
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
      {/* Toolbar and Filters */}
      <ShipmentToolbar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        showStatusFilter={false}
        onFacilityChange={handleFacilityChange}
        selectedFacility={selectedFacility}
        facilities={facilities}
        onClearFilters={clearFilters}
        onExport={handleExport}
        exporting={exporting}
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Refresh failed: {String(error)}</div>
      )}


      {/* Table */}
      <DeliveredShipmentTable
        shipments={shipments}
        onActionClick={openModal}
        canDelete={isAdmin}
        serverPagination={{ ...pageInfo, loading: refreshing, onPageChange: setPage }}
      />

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
                    toast.success('Shipment updated');
                    fetchShipments(); // Refresh data
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
                onUpdated={mergeShipment}
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
                onUpdated={mergeShipment}
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
    </div>
  );
}
