import React, { useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const statusOptions = [
  'pending',
  'processing',
  'in-transit',
  'arrived-at-hub',
  'departed-from-hub',
  'out-for-delivery',
  'delivered',
  'failed-delivery-attempt',
  'cancelled'
];

export default function ChangeStatusModal({ shipment, onClose, onStatusChange }) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (shipment) {
      setStatus(shipment.status || '');
    }
  }, [shipment]);

  const handleChangeStatus = () => {
    if (!status) return;
    onStatusChange({ shipmentId: shipment._id, newStatus: status });
    onClose();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Change Shipment Status</h2>
      <p className="text-sm text-muted-foreground">
        Update the status of the selected shipment:
      </p>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <div className='bg-green-100'>
            {statusOptions.map((option) => (
            <SelectItem key={option} value={option}>
              <div className='capitalize'>{option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
            </SelectItem>
          ))}
          </div>
        </SelectContent>
      </Select>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleChangeStatus} disabled={!status}>
          Update Status
        </Button>
      </div>
    </div>
  );
}
