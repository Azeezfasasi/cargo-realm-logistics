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
  'cancelled',
  'pickup-scheduled',
  'picked-up',
  'on-hold',
  'customs-clearance',
  'Awaiting Pickup',
  'Awaiting Delivery',
  'Arrived Carrier Connecting facility',
  'Departed CARGO realm facility (Nig)',
  'Arrived nearest airport', 'Shipment is Delayed',
  'Delivery date not available',
  'Available for pick up,check phone for instructions',
  'Processed in Lagos Nigeria', 'Pending Carrier lift',
  'Scheduled to depart on the next movement',
  'Received from flight',
  'Package is received and accepted by airline',
  'Customs clearance completed',
  'Delivery is booked',
  'Arrived at an international sorting facility and will be ready for delivery soon'
];

export default function ChangeStatusModal({ shipment, onClose, onStatusChange }) {
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (shipment) {
      setStatus(shipment.status || '');
      setLocation('');
    }
  }, [shipment]);

  const handleChangeStatus = () => {
    if (!status) return;
    onStatusChange({ 
      shipmentId: shipment._id, 
      newStatus: status,
      location: location.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Change Shipment Status</h2>
      <p className="text-sm text-gray-600">
        Update the status and location for the selected shipment:
      </p>
      
      {/* Status Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">New Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <div className='bg-green-50'>
              {statusOptions.map((option) => (
              <SelectItem key={option} value={option}>
                <div className='capitalize'>{option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
              </SelectItem>
            ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      {/* Location Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Location (Optional)</label>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Indianapolis - Indiana - USA"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
        <p className="text-xs text-gray-500">
          Enter the current location or hub where the shipment is at.
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleChangeStatus} 
          disabled={!status}
          className="bg-green-600 hover:bg-green-700"
        >
          Update Status & Location
        </Button>
      </div>
    </div>
  );
}
