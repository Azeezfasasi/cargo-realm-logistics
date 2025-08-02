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

  // useEffect(() => {
  //   if (shipment) {
  //     setFormData({
  //       sender: shipment.sender?.name || shipment.sender || '',
  //       recipientName: shipment.recipientName || '',
  //       origin: shipment.origin || '',
  //       destination: shipment.destination || '',
  //       status: shipment.status || '',
  //       notes: shipment.notes || ''
  //     });
  //   }
  // }, [shipment]);
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
      setReplies(shipment.replies || []);
    }
  }, [shipment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReply = () => {
    if (newReply.trim() !== '') {
      setReplies([...replies, {
        message: newReply,
        timestamp: new Date().toISOString(),
        user: 'You' // Replace with current user if available
      }]);
      setNewReply('');
    }
  };

  const handleSubmit = () => {
    onSave({ ...shipment, ...formData });
    onClose();
  };

  return (
  <div className='h-[500px] overflow-y-auto'>
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Edit Shipment</h2>
      <Input name="sender" placeholder="Sender Name" value={formData.sender} onChange={handleChange} />
      <Input name="recipientName" placeholder="Receiver Name" value={formData.recipientName} onChange={handleChange} />
      <Input name="origin" placeholder="Origin" value={formData.origin} onChange={handleChange} />
      <Input name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} />
      <Input name="status" placeholder="Status" value={formData.status} onChange={handleChange} />
      {/* <Textarea name="notes" placeholder="Additional Details" value={formData.notes} onChange={handleChange} rows={4} /> */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="outline" onClick={handleSubmit}>Save Changes</Button>
      </div>
    </div>
    <div>
      <h3 className="font-medium mt-4">Replies</h3>
      <ul className="space-y-1 text-sm">
        {replies.map((r, i) => (
          <li key={i}>
            <strong>{r.user?.name || r.user || 'Unknown'}:</strong> {r.message}
          </li>
        ))}
      </ul>
      <div className="mt-2 space-y-2">
        <Textarea
          placeholder="Add a reply..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          rows={2}
        />
        <Button size="sm" variant="outline" onClick={handleAddReply}>Add Reply</Button>
          {/* <button type='submit' onClick={handleAddReply} className='border p-2 bg-green-100 rounded-md'>Add Reply</button> */}
      </div>
    </div>
  </div>
  );
}

