import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function EditShipmentModal({ shipment, onClose, onSave }) {
  const [formData, setFormData] = useState({
    senderName: '',
    receiverName: '',
    origin: '',
    destination: '',
    status: '',
    details: ''
  });

  useEffect(() => {
    if (shipment) {
      setFormData({
        senderName: shipment.senderName || '',
        receiverName: shipment.receiverName || '',
        origin: shipment.origin || '',
        destination: shipment.destination || '',
        status: shipment.status || '',
        details: shipment.details || ''
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
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Edit Shipment</h2>
      <Input name="senderName" placeholder="Sender Name" value={formData.senderName} onChange={handleChange} />
      <Input name="receiverName" placeholder="Receiver Name" value={formData.receiverName} onChange={handleChange} />
      <Input name="origin" placeholder="Origin" value={formData.origin} onChange={handleChange} />
      <Input name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} />
      <Input name="status" placeholder="Status" value={formData.status} onChange={handleChange} />
      <Textarea name="details" placeholder="Additional Details" value={formData.details} onChange={handleChange} />
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </div>
    </div>
  );
}

