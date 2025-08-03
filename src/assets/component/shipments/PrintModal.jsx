import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useReactToPrint } from 'react-to-print';

export default function PrintModalContent({ shipment, onClose }) {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Shipment_${shipment?.trackingNumber || shipment?._id}`,
  });

  if (!shipment) return null;

  return (
    <>
      <h2 className="text-lg font-semibold">Print Shipment Details</h2>
      <div className="overflow-auto max-h-[70vh] my-4">
        <div ref={printRef} className="bg-white text-black p-4 text-sm">
          <h2 className="text-xl font-semibold mb-2">Shipment Information</h2>
          <p><strong>Tracking Number:</strong> {shipment.trackingNumber}</p>
          <p><strong>Sender:</strong> {shipment.senderName} ({shipment.senderPhone}) ({shipment.senderEmail})</p>
          <p><strong>Sender Address:</strong> {shipment.senderAddress}</p>
          <p><strong>Receiver:</strong> {shipment.recipientName} ({shipment.recipientPhone}) ({shipment.receiverEmail})</p>
          <p><strong>Receiver Address:</strong> {shipment.recipientAddress}</p>
          <p><strong>Origin:</strong> {shipment.origin}</p>
          <p><strong>Destination:</strong> {shipment.destination}</p>
          <p><strong>Status:</strong> {shipment.status}</p>
          <p><strong>Weight:</strong> {shipment.weight} kg</p>
          <p><strong>Length:</strong> {shipment.length} cm</p>
          <p><strong>Width:</strong> {shipment.width} cm</p>
          <p><strong>Height:</strong> {shipment.height} cm</p>
          <p><strong>Volume:</strong> {shipment.volume}</p>
          <p><strong>Cost:</strong> ₦{shipment.cost}</p>
          <p><strong>Date Created:</strong> {new Date(shipment.createdAt).toLocaleString()}</p>
          <hr className="my-3" />
          <p><strong>Description:</strong> {shipment.notes || 'N/A'}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handlePrint}>Print</Button>
      </div>
    </>
  );
}
