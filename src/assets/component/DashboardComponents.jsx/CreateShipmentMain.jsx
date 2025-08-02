import React from 'react';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const generateTrackingNumber = () => {
  const rand = Math.floor(10000000000 + Math.random() * 90000000000);
  return `Car${rand}`;
};

export default function CreateShipmentForm({ token }) {
  const [form, setForm] = useState({
    trackingNumber: generateTrackingNumber(),
    sender: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    origin: '',
    destination: '',
    status: 'pending',
    weight: '',
    shipmentDate: '',
    deliveryDate: '',
    notes: '',
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axios.get('/api/profile/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (shipmentData) => {
      const res = await axios.post('/api/shipments', shipmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Shipment created successfully');
      setForm((prev) => ({
        ...prev,
        trackingNumber: generateTrackingNumber(), // reset tracking number
        recipientName: '',
        recipientPhone: '',
        recipientAddress: '',
        origin: '',
        destination: '',
        weight: '',
        shipmentDate: '',
        deliveryDate: '',
        notes: '',
      }));
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error creating shipment');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.sender) {
      return toast.error('Please select a sender');
    }
    mutation.mutate(form);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl border">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Create New Shipment</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tracking Number</label>
          <input
            type="text"
            value={form.trackingNumber}
            readOnly
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assign Sender</label>
          <select
            name="sender"
            value={form.sender}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select user</option>
            {users &&
              users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName} ({user.email})
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={form.recipientName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Recipient Phone</label>
          <input
            type="text"
            name="recipientPhone"
            value={form.recipientPhone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Recipient Address</label>
          <textarea
            name="recipientAddress"
            value={form.recipientAddress}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Origin</label>
          <input
            type="text"
            name="origin"
            value={form.origin}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Destination</label>
          <input
            type="text"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {[
              'pending',
              'in-transit',
              'delivered',
              'cancelled',
              'processing',
              'pickup-scheduled',
              'out-for-delivery',
              'picked-up',
              'arrived-at-hub',
              'departed-from-hub',
              'on-hold',
              'customs-clearance',
              'Awaiting Pickup',
              'failed-delivery-attempt',
            ].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Shipment Date</label>
          <input
            type="date"
            name="shipmentDate"
            value={form.shipmentDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Delivery Date</label>
          <input
            type="date"
            name="deliveryDate"
            value={form.deliveryDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            {mutation.isLoading ? 'Creating Shipment...' : 'Create Shipment'}
          </button>
        </div>
      </form>
    </div>
  );
}
