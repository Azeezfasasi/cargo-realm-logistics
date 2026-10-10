// import React, { useState, useEffect } from 'react';
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';

// const statusOptions = [
//   'pending',
//   'processing',
//   'in-transit',
//   'arrived-at-hub',
//   'departed-from-hub',
//   'out-for-delivery',
//   'delivered',
//   'failed-delivery-attempt',
//   'cancelled',
//   'pickup-scheduled',
//   'picked-up',
//   'on-hold',
//   'customs-clearance',
//   'Awaiting Pickup',
//   'Awaiting Delivery',
//   'Arrived Carrier Connecting facility',
//   'Departed CARGO realm facility (Nig)',
//   'Arrived nearest airport', 'Shipment is Delayed',
//   'Delivery date not available',
//   'Available for pick up,check phone for instructions',
//   'Processed in Lagos Nigeria', 'Pending Carrier lift',
//   'Scheduled to depart on the next movement',
//   'Received from flight',
//   'Package is received and accepted by airline',
//   'Customs clearance completed',
//   'Delivery is booked',
//   'Arrived at an international sorting facility and will be ready for delivery soon'
// ];

// export default function ChangeStatusModal({ shipment, onClose, onStatusChange }) {
//   const [status, setStatus] = useState('');
//   const [location, setLocation] = useState('');

//   useEffect(() => {
//     if (shipment) {
//       setStatus(shipment.status || '');
//       setLocation('');
//     }
//   }, [shipment]);

//   const handleChangeStatus = () => {
//     if (!status) return;
//     onStatusChange({
//       shipmentId: shipment._id,
//       newStatus: status,
//       location: location.trim() || undefined
//     });
//     onClose();
//   };

//   return (
//     <div className="space-y-5">
//       <h2 className="text-lg font-semibold text-gray-900">Change Shipment Status</h2>
//       <p className="text-sm text-gray-600">
//         Update the status and location for the selected shipment:
//       </p>
      
//       {/* Status Selector */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium text-gray-700">New Status</label>
//         <Select value={status} onValueChange={setStatus}>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select status" />
//           </SelectTrigger>
//           <SelectContent>
//             <div className='bg-green-50'>
//               {statusOptions.map((option) => (
//               <SelectItem key={option} value={option}>
//                 <div className='capitalize'>{option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
//               </SelectItem>
//             ))}
//             </div>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Location Input */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium text-gray-700">Location (Optional)</label>
//         <div className="flex items-center gap-2">
//           <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//           <input
//             type="text"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             placeholder="e.g., Indianapolis - Indiana - USA"
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
//           />
//         </div>
//         <p className="text-xs text-gray-500">
//           Enter the current location or hub where the shipment is at.
//         </p>
//       </div>

//       <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
//         <Button variant="outline" onClick={onClose}>
//           Cancel
//         </Button>
//         <Button
//           onClick={handleChangeStatus}
//           disabled={!status}
//           className="bg-green-600 hover:bg-green-700"
//         >
//           Update Status & Location
//         </Button>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Camera, X, PackageCheck } from 'lucide-react';
import { compressImage } from './compressImage';

const isDeliveredStatus = (s) => String(s || '').trim().toLowerCase() === 'delivered';

export default function ChangeStatusModal({ shipment, onClose, onStatusChange, statuses = [] }) {
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Proof of delivery (only when marking as delivered)
  const [receivedBy, setReceivedBy] = useState('');
  const [podNotes, setPodNotes] = useState('');
  const [photo, setPhoto] = useState(null); // compressed JPEG data URL
  const [photoBusy, setPhotoBusy] = useState(false);

  useEffect(() => {
    if (shipment) {
      setStatus(shipment.status || '');
      setLocation('');
      setError('');
      setReceivedBy('');
      setPodNotes('');
      setPhoto(null);
    }
  }, [shipment]);

  // Ask for proof of delivery when the shipment is being marked delivered now
  const needsProof = isDeliveredStatus(status) && !isDeliveredStatus(shipment?.status);

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoBusy(true);
    setError('');
    try {
      setPhoto(await compressImage(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleChangeStatus = async () => {
    if (!status) return;
    if (needsProof && !receivedBy.trim()) {
      setError('Enter the name of the person who received the shipment.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await onStatusChange({
        shipmentId: shipment._id,
        newStatus: status,
        location: location.trim() || undefined,
        proofOfDelivery: needsProof
          ? { receivedBy: receivedBy.trim(), notes: podNotes.trim() || undefined, photo: photo || undefined }
          : undefined,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update status. Please try again.');
      setLoading(false);
    }
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
        <Select value={status} onValueChange={setStatus} disabled={loading}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <div className='bg-blue-50'>
              {statuses.map((status) => {
                const statusName = status.name || status;
                return (
                  <SelectItem key={statusName} value={statusName}>
                    <div className='capitalize'>{statusName}</div>
                  </SelectItem>
                );
              })}
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
            disabled={loading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-gray-500">
          Enter the current location or hub where the shipment is at.
        </p>
      </div>

      {needsProof && (
        <div className="space-y-3 rounded-xl border border-green-200 bg-green-50/60 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-800">
            <PackageCheck size={16} /> Proof of delivery
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Received by <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              placeholder="Name of the person who received it"
              disabled={loading}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Delivery notes (optional)</label>
            <textarea
              value={podNotes}
              onChange={(e) => setPodNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Left with security at reception"
              disabled={loading}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Photo (optional)</label>
            {photo ? (
              <div className="relative w-fit">
                <img src={photo} alt="Delivery" className="h-28 rounded-lg border border-gray-200 object-cover" />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  disabled={loading}
                  aria-label="Remove photo"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-600 shadow ring-1 ring-gray-200 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:border-green-400 hover:text-green-700 ${photoBusy || loading ? 'pointer-events-none opacity-60' : ''}`}>
                <Camera size={16} />
                {photoBusy ? 'Processing photo…' : 'Add photo of signed waybill or package'}
                <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
              </label>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleChangeStatus} 
          disabled={!status || loading || photoBusy}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {loading ? 'Updating...' : needsProof ? 'Confirm Delivery' : 'Update Status & Location'}
        </Button>
      </div>
    </div>
  );
}
