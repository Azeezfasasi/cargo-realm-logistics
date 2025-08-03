import React, { useEffect, useState } from 'react';
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

export default function AllShipmentsMain({ token }) {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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

  const fetchShipments = async () => {
    setLoading(true); // Start loading
    try {
      const res = await axios.get(`${API_BASE_URL}/shipments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sorted = res.data.sort((a, b) => getTimestamp(b) - getTimestamp(a));
      setShipments(sorted);
      setFilteredShipments(sorted);
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  useEffect(() => {
    fetchShipments();
  }, [token]);

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm); // <-- Add this
    const term = searchTerm.toLowerCase();
    const result = shipments.filter((shipment) =>
      shipment.trackingNumber?.toLowerCase().includes(term) ||
      shipment.senderName?.toLowerCase().includes(term) ||
      shipment.destination?.toLowerCase().includes(term) ||
      shipment.status?.toLowerCase().includes(term)
    );
    setFilteredShipments(result);
  };


  const handleFilter = (status) => {
    if (!status) {
      setFilteredShipments(shipments);
    } else {
      const result = shipments.filter((s) => s.status === status);
      setFilteredShipments(result);
    }
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

    const handleStatusChange = async ({ shipmentId, newStatus }) => {
        try {
            await axios.patch(`${API_BASE_URL}/shipments/${shipmentId}/status`, { status: newStatus }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            await fetchShipments(); 
        } catch (err) {
            console.error("Failed to update status", err);
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

  return (
    <div className="p-4 space-y-6">
      {/* Toolbar and Filters */}
      <ShipmentToolbar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onStatusChange={handleFilter}
        onExport={() => exportToExcel(filteredShipments, 'All_Shipments')}
      />


      {/* Table */}
      <ShipmentTable
        shipments={filteredShipments}
        onActionClick={openModal}
        onDeleteClick={(shipment) => openModal(shipment, 'delete')}
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
          />
        </BasicModal>
        )}

        {selectedShipment && (
        <BasicModal isOpen={modalType === 'print'} onClose={closeModal}>
            <PrintModal shipment={selectedShipment} onClose={closeModal} />
        </BasicModal>
        )}
    </div>
  );
}
