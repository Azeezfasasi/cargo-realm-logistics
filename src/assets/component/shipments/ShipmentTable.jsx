import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Mail, Trash2, FileText, Printer, Truck, RefreshCcw } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function ShipmentTable({ shipments, onActionClick }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(shipments.length / ITEMS_PER_PAGE);
  const paginated = shipments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      console.log('Delete ID:', id);
      // handle deletion logic here
    }
  };

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-900 shadow-md overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Tracking No</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Status</th>
            <th className="p-3">Destination</th>
            <th className="p-3">Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((shipment, idx) => (
            <tr key={shipment._id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-3">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
              <td className="p-3 font-medium">{shipment.trackingNumber}</td>
              <td className="p-3">{shipment.customerName}</td>
              <td className="p-3">{shipment.status}</td>
              <td className="p-3">{shipment.destination}</td>
              <td className="p-3">{new Date(shipment.createdAt).toLocaleDateString()}</td>
              <td className="p-3 space-x-1">
                <Button size="icon" variant="ghost" onClick={() => onActionClick(shipment, 'edit')}>
                  <Pencil size={16} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onActionClick(shipment, 'reply')}>
                  <Mail size={16} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onActionClick(shipment, 'status')}>
                  <RefreshCcw size={16} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(shipment._id)}>
                  <Trash2 size={16} className="text-red-500" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onActionClick(shipment, 'print')}>
                  <Printer size={16} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onActionClick(shipment, 'invoice')}>
                  <FileText size={16} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onActionClick(shipment, 'waybill')}>
                  <Truck size={16} />
                </Button>
              </td>
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr>
              <td colSpan={7} className="p-3 text-center text-gray-500">
                No shipments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
