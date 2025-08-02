import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function EditShipmentModal({ shipment, onClose, onSave }) {
  const [newReply, setNewReply] = useState('');
  const [replies, setReplies] = useState([]);
  const [formData, setFormData] = useState({
    sender: '',
    recipientName: '',
    origin: '',
    destination: '',
    status: '',
    notes: ''
  });

  useEffect(() => {
    if (shipment) {
      setFormData({
        sender: shipment.sender?.name || shipment.sender || '',
        recipientName: shipment.recipientName || '',
        origin: shipment.origin || '',
        destination: shipment.destination || '',
        status: shipment.status || '',
        notes: shipment.notes || ''
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
      <Input name="sender" placeholder="Sender Name" value={formData.sender} onChange={handleChange} />

      <label>Receiver Name</label>
      <Input name="recipientName" placeholder="Receiver Name" value={formData.recipientName} onChange={handleChange} />

      <label>Origin</label>
      <Input name="origin" placeholder="Origin" value={formData.origin} onChange={handleChange} />

      <label>Destination</label>
      <Input name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} />

      <label>Status</label>
      {/* <Input name="status" placeholder="Status" value={formData.status} onChange={handleChange} /> */}
      <select name="status" id="status" value={formData.status} onChange={handleChange} className='w-full border p-2 rounded-md'>
        <option value="">Change Status</option>
        <option value="processing">Processing</option>
        <option value="pending">Pending</option>
        <option value="in-transit">In Transit</option>
        <option value="arrived-at-hub">Arrived at Hub</option>
        <option value="departed-from-hub">Departed from Hub</option>
        <option value="out-for-delivery">Out for Delivery</option>
      </select>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="outline" onClick={handleSubmit}>Save Changes</Button>
      </div>
    </div>
  </div>
  );
}

