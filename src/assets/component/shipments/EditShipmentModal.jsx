import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function EditShipmentModal({ shipment, onClose, onSave }) {
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderAddress: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    receiverEmail: '',
    origin: '',
    destination: '',
    status: 'pending',
    weight: '',
    notes: '',
    length: '',
    width: '',
    height: '',
    volume: '',
    cost: '',
  });

  useEffect(() => {
    if (shipment) {
      setFormData({
        // sender: shipment.sender?.name || shipment.sender.name ||  '',
        senderName: shipment.senderName || '',
        senderPhone: shipment.senderPhone || '',
        senderEmail: shipment.senderEmail || '',
        senderAddress: shipment.senderAddress || '',
        recipientName: shipment.recipientName || '',
        recipientPhone: shipment.recipientPhone || '',
        recipientAddress: shipment.recipientAddress || '',
        receiverEmail: shipment.receiverEmail || '',
        weight: shipment.weight || '',
        origin: shipment.origin || '',
        destination: shipment.destination || '',
        status: shipment.status || '',
        notes: shipment.notes || '',
        length: shipment.length || '',
        width: shipment.width || '',
        height: shipment.height || '',
        volume: shipment.volume || '',
        cost: shipment.cost || ''
      });
    }
  }, [shipment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...shipment, ...formData });
    onClose();
  };

  return (
  <div className='h-[500px] overflow-y-auto'>
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Edit Shipment</h2>
      
      <label>Sender Name</label>
      <Input name="senderName" placeholder="Sender Name" value={formData.senderName} onChange={handleChange} />
      
      <label>Sender Phone Number</label>
      <Input name="senderPhone" placeholder="Sender Phone Number" value={formData.senderPhone} onChange={handleChange} />
      
      <label>Sender Email Address</label>
      <Input name="senderEmail" placeholder="Sender Email Address" value={formData.senderEmail} onChange={handleChange} />
      
      <label>Sender Home Address</label>
      <Input name="senderAddress" placeholder="Sender Home Address" value={formData.senderAddress} onChange={handleChange} />

      <label>Receiver Name</label>
      <Input name="recipientName" placeholder="Receiver Name" value={formData.recipientName} onChange={handleChange} />
      
      <label>Receiver Email Address</label>
      <Input name="receiverEmail" placeholder="Receiver Email Address" value={formData.receiverEmail} onChange={handleChange} />
      
      <label>Receiver Phone Number</label>
      <Input name="recipientPhone" placeholder="Receiver Phone Number" value={formData.recipientPhone} onChange={handleChange} />
      
      <label>Receiver Address</label>
      <Input name="recipientAddress" placeholder="Receiver Home Address" value={formData.recipientAddress} onChange={handleChange} />
      
      <label>Weight (kg)</label>
      <Input name="weight" placeholder="weight (kg)" value={formData.weight} onChange={handleChange} />
      
      <label>Length - (Optional)</label>
      <Input name="length" placeholder="Length" value={formData.length} onChange={handleChange} />
      
      <label>Width - (Optional)</label>
      <Input name="width" placeholder="Width" value={formData.width} onChange={handleChange} />
      
      <label>Height - (Optional)</label>
      <Input name="height" placeholder="Height" value={formData.height} onChange={handleChange} />
      
      <label>Volume - (Optional)</label>
      <Input name="volume" placeholder="Volume" value={formData.volume} onChange={handleChange} />
      
      <label>Shipping Cost (₦) - (Optional)</label>
      <Input name="cost" placeholder="Shipping cost" value={formData.cost} onChange={handleChange} />

      <label>Origin</label>
      <Input name="origin" placeholder="Origin" value={formData.origin} onChange={handleChange} />

      <label>Destination</label>
      <Input name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} />

      <label className=''>
        Status
      <select name="status" id="status" value={formData.status} onChange={handleChange} className='w-full border p-2 rounded-md'>
        <option value="">Change Status</option>
        <option value="processing">Processing</option>
        <option value="pending">Pending</option>
        <option value="in-transit">In Transit</option>
        <option value="arrived-at-hub">Arrived at Hub</option>
        <option value="departed-from-hub">Departed from Hub</option>
        <option value="out-for-delivery">Out for Delivery</option>
        <option value="pickup-scheduled">Pickup Scheduled</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
        <option value="picked-up">Picked Up</option>
        <option value="on-hold">On Hold</option>
        <option value="customs-clearance">Customs Clearance</option>
        <option value="Awaiting Pickup">Awaiting Pickup</option>
        <option value="failed-delivery-attempt">Failed Delivery Attempt</option>
        <option value="Awaiting Delivery">Awaiting Delivery</option>
        <option value="Arrived Carrier Connecting facility">Arrived Carrier Connecting facility</option>
        <option value="Departed CARGO realm facility (Nig)">Departed CARGO realm facility (Nig)</option>
        <option value="Arrived nearest airport">Arrived Nearest Airport</option>
        <option value="Shipment is Delayed">Shipment is Delayed</option>
        <option value="Delivery date not available">Delivery date not available</option>
        <option value="Available for pick up,check phone for instructions">Available for pick up,check phone for instructions</option>
        <option value="Processed in Lagos Nigeria">Processed in Lagos Nigeria</option>
        <option value="Pending Carrier lift">Pending Carrier lift</option>
        <option value="Scheduled to depart on the next movement">Scheduled to depart on the next movement</option>
        <option value="Received from flight">Received from flight</option>
        <option value="Package is received and accepted by airline">Package is received and accepted by airline</option>
        </select>
      </label>
      
      <div className='mt-4 flex flex-col'>
        <label>Notes</label>
        <Textarea name="notes" placeholder="Additional Details" value={formData.notes} onChange={handleChange} />
        <div className="flex justify-end space-x-2 mt-5">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>
    </div>
  </div>
  );
}

