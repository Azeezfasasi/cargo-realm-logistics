import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaSpinner, FaTimesCircle, FaUser, FaBox, FaMapMarkerAlt, FaFileAlt, FaPhone, FaEnvelope, FaMapPin, FaPlus, FaTrash } from 'react-icons/fa'; 
import { API_BASE_URL } from '../../../config/Api';

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
    items: [], 
    weight: '',
    shipmentDate: '',
    deliveryDate: '',
    notes: '',
    length: '',
    width: '',
    height: '',
    breadth: '',
    volume: '',
    cost: '',
    shipmentPieces: '',
    shipmentType: '',
    shipmentPurpose: '',
    shipmentFacility: '',
  });

  // State for the new item input
  const [newItem, setNewItem] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [senderMode, setSenderMode] = useState('select'); // 'select' or 'email'

  // Fetch users for the sender dropdown (for auto-lookup)
  const {
    data: users
  } = useQuery({

    queryKey: ['allUsers'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/profile/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return Array.isArray(res.data) ? res.data : [];
    },

    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
  
  // Fetch facilities
  const {
    data: facilities = []
  } = useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/facilities`);
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async (shipmentData) => {
      // Client-side retry for duplicate tracking numbers
      const maxAttempts = 5;
      let attempt = 0;
      let lastError;
      let payload = { ...shipmentData };
      while (attempt < maxAttempts) {
        try {
          const res = await axios.post(`${API_BASE_URL}/shipments`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return res.data;
        } catch (err) {
          lastError = err;
          // If duplicate key on trackingNumber, regenerate and retry
          const isDuplicate = err?.response?.data?.errmsg?.includes('duplicate key') || err?.response?.status === 409 || (err?.code === 11000 || err?.response?.data?.code === 11000);
          if (isDuplicate) {
            attempt += 1;
            payload = { ...shipmentData, trackingNumber: generateTrackingNumber() };
            console.warn(`Duplicate tracking number detected. Retrying with new tracking number (attempt ${attempt})`);
            continue;
          }
          // Non-retryable error: rethrow
          throw err;
        }
      }
      // if we exit loop without success, throw last error
      throw lastError;
    },
    onSuccess: () => {
      setSubmitting(false);
      toast.success('Shipment created successfully');
      setSenderMode('select'); // Reset to select mode
      setForm((prev) => ({
        ...prev,
        trackingNumber: generateTrackingNumber(), // reset tracking number
        sender: '', // Reset sender selection
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
        items: [],
        weight: '',
        shipmentDate: '',
        deliveryDate: '',
        notes: '',
        length: '',
        width: '',
        height: '',
        breadth: '',
        volume: '',
        cost: '',
        shipmentPieces: '',
        shipmentType: '',
        shipmentPurpose: '',
        shipmentFacility: '',
      }));
      // Reset the new item input field
      setNewItem('');
    },
    onError: (err) => {
      setSubmitting(false);
      const message = err?.response?.data?.message || err?.message || 'Error creating shipment';
      // Show helpful guidance if duplicate-key exhausted
      if (err?.response?.data?.errmsg?.includes('duplicate key') || err?.code === 11000) {
        toast.error('Duplicate tracking number. Please try again or contact support.');
      } else {
        toast.error(message);
      }
      console.error('Create shipment error (frontend):', err);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle sender email change and auto-lookup user
  const handleSenderEmailChange = (e) => {
    const email = e.target.value;
    setForm((prev) => ({ ...prev, senderEmail: email }));

    // Auto-lookup user if email matches an existing user
    if (email && users) {
      const matchedUser = users.find(user => user.email?.toLowerCase() === email.toLowerCase());
      if (matchedUser) {
        setForm((prev) => ({
          ...prev,
          sender: matchedUser._id,
          senderName: matchedUser.fullName || '',
          senderPhone: matchedUser.phone || '',
          senderAddress: matchedUser.address || '',
        }));
      } else {
        // Clear sender if email doesn't match any user
        setForm((prev) => ({
          ...prev,
          sender: '',
        }));
      }
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim() !== '') {
      setForm(prevForm => ({
        ...prevForm,
        items: [...prevForm.items, newItem.trim()]
      }));
      setNewItem('');
    }
  };

  const handleRemoveItem = (index) => {
    setForm(prevForm => ({
      ...prevForm,
      items: prevForm.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (senderMode === 'select' && !form.sender) {
      return toast.error('Please select a sender from the system');
    }
    if (senderMode === 'email' && !form.senderEmail) {
      return toast.error('Please enter a sender email address');
    }
    setSubmitting(true);

    // Sanitize form data: convert empty string sender to null
    const sanitizedForm = { ...form };
    if (sanitizedForm.sender === '') {
      sanitizedForm.sender = null;
    }
    
    mutation.mutate(sanitizedForm);
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg">
              <FaBox className="text-white lg:text-2xl" />
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Create New Shipment
            </h1>
          </div>
          <p className="text-gray-600 ml-14 text-sm">Fill in the details to create and track your shipment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tracking Number - Highlighted Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
            <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              Tracking Number (Auto-Generated)
            </label>
            <input
              type="text"
              value={form.trackingNumber}
              readOnly
              className="w-full bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-3 text-gray-800 font-mono font-semibold focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
            />
          </div>

          {/* Sender Information Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-green-600">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center gap-3">
              <FaUser className="text-white text-xl" />
              <h3 className="text-[17px] lg:text-xl font-bold text-white">Sender Information</h3>
            </div>
            <div className="p-6">
              {/* Sender Mode Toggle */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">How would you like to assign the sender?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSenderMode('select')}
                    className={`py-1 lg:py-3 px-1 lg:px-4 text-[13px] lg:text-[16px] rounded-lg font-medium transition-all duration-200 border-2 cursor-pointer ${
                      senderMode === 'select'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    <FaUser className="inline mr-2" />
                    Select Existing User
                  </button>
                  <button
                    type="button"
                    onClick={() => setSenderMode('email')}
                    className={`py-1 lg:py-3 px-1 lg:px-4 text-[13px] lg:text-[16px] rounded-lg font-medium transition-all duration-200 border-2 cursor-pointer ${
                      senderMode === 'email'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    <FaEnvelope className="inline mr-2" />
                    Enter Email
                  </button>
                </div>
              </div>

              {/* Select Existing User Mode */}
              {senderMode === 'select' && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg mb-6 animate-fadeIn">
                  <select
                    name="sender"
                    value={form.sender}
                    onChange={handleChange}
                    className="w-full border-2 border-green-300 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 transition text-gray-700 font-medium"
                  >
                    <option value="">Select a user from the system</option>
                    {users && users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.fullName} ({user.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-green-700 mt-3 font-medium">💡 Choose an existing user to assign as the sender.</p>
                </div>
              )}

              {/* Enter Manual Email Mode */}
              {senderMode === 'email' && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg mb-6 animate-fadeIn">
                  <input
                    type="email"
                    name="senderEmail"
                    value={form.senderEmail}
                    onChange={handleSenderEmailChange}
                    placeholder='example@domain.com'
                    className="w-full border-2 border-green-300 rounded-lg p-3 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-300 transition text-gray-700 placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-600 mt-3">The system will auto-link if email exists, or send confirmation.</p>
                  {form.sender && (
                    <p className="text-xs text-green-700 mt-2 font-bold">✓ Linked to existing user</p>
                  )}
                </div>
              )}

              {/* Sender Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUser className="text-green-600 text-xs" />
                    Sender Name
                  </label>
                  <input
                    type="text"
                    name="senderName"
                    value={form.senderName}
                    placeholder='Full name'
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaPhone className="text-green-600 text-xs" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="senderPhone"
                    value={form.senderPhone}
                    placeholder='+234 XXX XXXX XXX'
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-green-600 text-xs" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="senderEmail"
                    value={form.senderEmail}
                    placeholder='email@example.com'
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaMapPin className="text-green-600 text-xs" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="senderAddress"
                    value={form.senderAddress}
                    placeholder='Street address'
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recipient Information Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-green-600">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center gap-3">
              <FaUser className="text-white text-xl" />
              <h3 className="text-[16px] lg:text-xl font-bold text-white">Receiver Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-green-600 text-xs" />
                  Receiver Name
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={form.recipientName}
                  placeholder='Full name'
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaPhone className="text-green-600 text-xs" />
                  Phone Number
                </label>
                <input
                  type="text"
                  name="recipientPhone"
                  value={form.recipientPhone}
                  placeholder='+234 XXX XXXX XXX'
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-green-600 text-xs" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="receiverEmail"
                  value={form.receiverEmail}
                  placeholder='email@example.com'
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapPin className="text-green-600 text-xs" />
                  Address
                </label>
                <input
                  type="text"
                  name="recipientAddress"
                  placeholder='Street address'
                  value={form.recipientAddress}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder-gray-400 md:col-span-2"
                />
              </div>
            </div>
          </div>

          {/* Route Information Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-orange-600">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex items-center gap-3">
              <FaMapMarkerAlt className="text-white text-xl" />
              <h3 className="text-[16px] lg:text-xl font-bold text-white">Route Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-600 text-xs" />
                  Origin (Pickup)
                </label>
                <input
                  type="text"
                  name="origin"
                  value={form.origin}
                  onChange={handleChange}
                  placeholder='Country/City'
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-600 text-xs" />
                  Destination (Delivery)
                </label>
                <input
                  type="text"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder='Country/City'
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-purple-600">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center gap-3">
              <FaBox className="text-white text-xl" />
              <h3 className="text-[16px] lg:text-xl font-bold text-white">Items in Shipment</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="e.g., Electronics, Documents, Clothing..."
                  className="flex-grow border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                >
                  <FaPlus />
                </button>
              </div>

              {form.items.length > 0 && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-purple-700 mb-3">Added Items ({form.items.length})</p>
                  <div className="space-y-2">
                    {form.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg border-l-4 border-purple-500">
                        <span className="text-gray-700 font-medium">{index + 1}. {item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipment Details Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-cyan-600">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 flex items-center gap-3">
              <FaFileAlt className="text-white text-xl" />
              <h3 className="text-[16px] lg:text-xl font-bold text-white">Shipment Details</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Dimensions */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b-2 border-cyan-200">Dimensions & Weight</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={form.weight}
                      onChange={handleChange}
                      placeholder='0'
                      className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Length (cm) - Optional</label>
                    <input
                      type="number"
                      name="length"
                      value={form.length}
                      onChange={handleChange}
                      placeholder='0'
                      className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Width (cm) - Optional</label>
                    <input
                      type="number"
                      name="width"
                      value={form.width}
                      onChange={handleChange}
                      placeholder='0'
                      className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Height (cm) - Optional</label>
                    <input
                      type="number"
                      name="height"
                      value={form.height}
                      onChange={handleChange}
                      placeholder='0'
                      className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Breadth & Volume */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Breadth (cm) - Optional</label>
                  <input
                    type="number"
                    name="breadth"
                    value={form.breadth}
                    onChange={handleChange}
                    placeholder='0'
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Volume - Optional</label>
                  <input
                    type="number"
                    name="volume"
                    value={form.volume}
                    onChange={handleChange}
                    placeholder='Auto-calculate or enter manually'
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition"
                  />
                </div>
              </div>

              {/* Type & Purpose */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shipment Type</label>
                  <select
                    name="shipmentType"
                    value={form.shipmentType}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition text-gray-700"
                  >
                    <option value="">Select type</option>
                    <option value="Boxes">📦 Boxes</option>
                    <option value="Padding">🛡️ Padding</option>
                    <option value="Package">📮 Package</option>
                    <option value="Document">📄 Document</option>
                    <option value="Other">🎁 Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shipment Purpose</label>
                  <select
                    name="shipmentPurpose"
                    value={form.shipmentPurpose}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition text-gray-700"
                  >
                    <option value="">Select purpose</option>
                    <option value="Personal">👤 Personal</option>
                    <option value="Gift">🎀 Gift</option>
                    <option value="Commercial">🏢 Commercial</option>
                    <option value="Return for Repair">🔧 Return for Repair</option>
                    <option value="Sample">🧪 Sample</option>
                    <option value="Other">📌 Other</option>
                  </select>
                </div>
              </div>

              {/* Facility & Pieces */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shipment Facility</label>
                  <select
                    name="shipmentFacility"
                    value={form.shipmentFacility}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition text-gray-700"
                    required
                  >
                    <option value="">Select facility</option>
                    {Array.isArray(facilities) && facilities.length > 0 ? (
                      facilities.filter(f => f.isActive !== false).map(facility => (
                        <option key={facility._id} value={facility.name}>
                          {facility.name} {facility.city ? `(${facility.city})` : ''}
                        </option>
                      ))
                    ) : (
                    <>
                    <option value="Lagos">🇳🇬 Lagos</option>
                    <option value="Atlanta">🇺🇸 Atlanta</option>
                    <option value="Indianapolis">🇺🇸 Indianapolis</option>
                    <option value="New York">🇺🇸 New York</option>
                    <option value="New Jersey">🇺🇸 New Jersey</option>
                    <option value="Maryland">🇺🇸 Maryland</option>
                    <option value="Dallas">🇺🇸 Dallas</option>
                    <option value="Houston">🇺🇸 Houston</option>
                    <option value="United States of America">🇺🇸 United States</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Ontario">🇨🇦 Ontario</option>
                    <option value="Calgary">🇨🇦 Calgary</option>
                    <option value="Edmonton">🇨🇦 Edmonton</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                   </>
                   )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shipment Pieces</label>
                  <input
                    type="text"
                    name="shipmentPieces"
                    value={form.shipmentPieces}
                    onChange={handleChange}
                    placeholder='e.g., 5 pieces, 10 cartons'
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Dates & Cost */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shipment Date</label>
                  <input
                    type="date"
                    name="shipmentDate"
                    value={form.shipmentDate}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Date</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={form.deliveryDate}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Cost (₦)</label>
                  <input
                    type="text"
                    name="cost"
                    value={form.cost}
                    onChange={handleChange}
                    placeholder='0.00'
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder='Add any special handling instructions or additional details...'
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition placeholder-gray-400"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={mutation.isLoading || submitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 text-[16px] lg:text-lg"
            >
              {(mutation.isLoading || submitting) ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Creating Shipment...</span>
                </>
              ) : (
                <>
                  <FaBox />
                  <span>Create Shipment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

