import React from 'react';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const generateTrackingNumber = () => {
  const rand = Math.floor(10000000000 + Math.random() * 90000000000);
  return `CAR${rand}`;
};

export default function CreateShipmentForm({ token }) {
  const [form, setForm] = useState({
    trackingNumber: generateTrackingNumber(),
    sender: '',
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
    shipmentDate: '',
    deliveryDate: '',
    notes: '',
    length: '',
    width: '',
    height: '',
    volume: '',
    cost: '',
  });

  const { data: users, isLoading, isError } = useQuery({
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
        shipmentDate: '',
        deliveryDate: '',
        notes: '',
        length: '',
        width: '',
        height: '',
        volume: '',
        cost: '',
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

  if (isLoading) return <p>Loading users...</p>;
  if (isError || !Array.isArray(users)) return <p>Failed to load users.</p>;


  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl border border-solid border-green-600">
      <h2 className="text-2xl font-semibold mb-6 text-green-700">Create New Shipment</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tracking Number</label>
          <input
            type="text"
            value={form.trackingNumber}
            readOnly
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assign Sender</label>
          <select
            name="sender"
            value={form.sender}
            onChange={handleChange}
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          >
            <option value="">Select user</option>
            {/* {users &&
              users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName} ({user.email})
                </option>
              ))} */}
            {Array.isArray(users) &&
            users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullName} ({user.email})
              </option>
            ))}

          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sender Name</label>
          <input
            type="text"
            name="senderName"
            value={form.senderName}
            placeholder='Enter the sender name'
            onChange={handleChange}
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sender Phone Number</label>
          <input
            type="text"
            name="senderPhone"
            value={form.senderPhone}
            onChange={handleChange}
            placeholder='Enter the sender Phone Number'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sender Email Address</label>
          <input
            type="email"
            name="senderEmail"
            value={form.senderEmail}
            onChange={handleChange}
            placeholder='Enter the sender Email Address'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sender Address</label>
          <input
            type="text"
            name="senderAddress"
            value={form.senderAddress}
            onChange={handleChange}
            placeholder='Enter the sender Home Address'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Receiver Name</label>
          <input
            type="text"
            name="recipientName"
            value={form.recipientName}
            onChange={handleChange}
            placeholder='Enter the receiver name'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Receiver Email</label>
          <input
            type="email"
            name="receiverEmail"
            value={form.receiverEmail}
            onChange={handleChange}
            placeholder='Enter the receiver email'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Receiver Phone</label>
          <input
            type="text"
            name="recipientPhone"
            value={form.recipientPhone}
            onChange={handleChange}
            placeholder='Enter the receiverphone number'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Receiver Address</label>
          <textarea
            name="recipientAddress"
            value={form.recipientAddress}
            onChange={handleChange}
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
            placeholder='Enter the receiver home address'
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
            placeholder='Enter the country/city of origin'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Destination</label>
          <input
            type="text"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder='Enter the country/city of destination'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder='Enter the weight of the shipment in kg'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Length (Optional)</label>
          <input
            type="number"
            name="length"
            value={form.length}
            onChange={handleChange}
            placeholder='Optional:Enter the Length of the shipment'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Width (Optional)</label>
          <input
            type="number"
            name="width"
            value={form.width}
            onChange={handleChange}
            placeholder='Optional:Enter the width of the shipment'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Height (Optional)</label>
          <input
            type="number"
            name="height"
            value={form.height}
            onChange={handleChange}
            placeholder='Optional:Enter the height of the shipment'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Volume (Optional)</label>
          <input
            type="number"
            name="volume"
            value={form.volume}
            onChange={handleChange}
            placeholder='Optional: Enter the volume of the shipment'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Shipping Cost (₦) - (Optional)</label>
          <input
            type="text"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            placeholder='Optional: Enter the total cost of the shipment'
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
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
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Delivery Date</label>
          <input
            type="date"
            name="deliveryDate"
            value={form.deliveryDate}
            onChange={handleChange}
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600"
            placeholder='Enter any notes or comments about the shipment here. You can also include all the items here.'
            rows={3}
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
          >
            {mutation.isLoading ? 'Creating Shipment...' : 'Create Shipment'}
          </button>
        </div>
      </form>
    </div>
  );
}
