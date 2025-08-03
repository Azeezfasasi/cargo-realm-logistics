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

export default function AllShipmentsMain({ token }) {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchShipments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/shipments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShipments(res.data);
      setFilteredShipments(res.data);
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [token]);

  const handleSearch = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    const result = shipments.filter((shipment) =>
      shipment.trackingId.toLowerCase().includes(term) ||
      shipment.sender.name.toLowerCase().includes(term) ||
      shipment.recipient.name.toLowerCase().includes(term)
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

  // const handleDeleteShipment = async (id) => {
  //   try {
  //     await axios.delete(`${API_BASE_URL}/shipments/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     fetchShipments();
  //   } catch (err) {
  //     console.error('Failed to delete shipment:', err);
  //   }
  // };
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
            await fetchShipments(); // Refresh shipment list after update
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

  return (
    <div className="p-4 space-y-6">
      {/* Toolbar and Filters */}
      <ShipmentToolbar
        onSearch={handleSearch}
        onFilter={handleFilter}
        onExport={() => exportToExcel(filteredShipments, 'All_Shipments')}
      />

      {/* <SearchFilterBar data={shipments} setFiltered={setFilteredShipments} /> */}

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
