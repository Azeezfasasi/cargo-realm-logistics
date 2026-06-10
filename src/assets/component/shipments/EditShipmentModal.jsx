// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { FaPlus, FaTrash } from 'react-icons/fa'; // Import the icons

// export default function EditShipmentModal({ shipment, onClose, onSave }) {
//   const [formData, setFormData] = useState({
//     senderName: '',
//     senderPhone: '',
//     senderEmail: '',
//     senderAddress: '',
//     recipientName: '',
//     recipientPhone: '',
//     recipientAddress: '',
//     receiverEmail: '',
//     origin: '',
//     destination: '',
//     status: 'pending',
//     weight: '',
//     notes: '',
//     length: '',
//     width: '',
//     height: '',
//     volume: '',
//     cost: '',
//     items: [],
//     shipmentPieces: '',
//     shipmentType: '',
//     shipmentPurpose: '',
//     shipmentFacility: '',
//     shipmentDate: '',
//     deliveryDate: '',
//   });

//   // State for the new item input
//   const [newItem, setNewItem] = useState('');

//   useEffect(() => {
//     if (shipment) {
//       setFormData({
//         senderName: shipment.senderName || '',
//         senderPhone: shipment.senderPhone || '',
//         senderEmail: shipment.senderEmail || '',
//         senderAddress: shipment.senderAddress || '',
//         recipientName: shipment.recipientName || '',
//         recipientPhone: shipment.recipientPhone || '',
//         recipientAddress: shipment.recipientAddress || '',
//         receiverEmail: shipment.receiverEmail || '',
//         weight: shipment.weight || '',
//         origin: shipment.origin || '',
//         destination: shipment.destination || '',
//         status: shipment.status || '',
//         notes: shipment.notes || '',
//         length: shipment.length || '',
//         width: shipment.width || '',
//         height: shipment.height || '',
//         volume: shipment.volume || '',
//         cost: shipment.cost || '',
//         items: shipment.items || [],
//         shipmentPieces: shipment.shipmentPieces || '',
//         shipmentType: shipment.shipmentType || '',
//         shipmentPurpose: shipment.shipmentPurpose || '',
//         shipmentFacility: shipment.shipmentFacility || '',
//         shipmentDate: shipment.shipmentDate ? shipment.shipmentDate.split('T')[0] : '',
//         deliveryDate: shipment.deliveryDate ? shipment.deliveryDate.split('T')[0] : '',
//       });
//       setNewItem('');
//     }
//   }, [shipment]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     onSave({ ...shipment, ...formData });
//     onClose();
//   };

//   const handleAddItem = (e) => {
//     e.preventDefault();
//     if (newItem.trim() !== '') {
//       // ✅ Corrected: Update formData state instead of 'form'
//       setFormData(prevFormData => ({
//         ...prevFormData,
//         items: [...prevFormData.items, newItem.trim()]
//       }));
//       setNewItem('');
//     }
//   };

//   const handleRemoveItem = (index) => {
//     // ✅ Corrected: Update formData state instead of 'form'
//     setFormData(prevFormData => ({
//       ...prevFormData,
//       items: prevFormData.items.filter((_, i) => i !== index)
//     }));
//   };

//   return (
//     <div className='h-[500px] overflow-y-auto'>
//       <div className="space-y-3">
//         <h2 className="text-lg font-semibold">Edit Shipment</h2>
        
//         <label>Sender Name</label>
//         <input type="text" name="senderName" placeholder="Sender Name" value={formData.senderName} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />
        
//         <label>Sender Phone Number</label>
//         <input type="tel" name="senderPhone" placeholder="Sender Phone Number" value={formData.senderPhone} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />
        
//         <label>Sender Email Address</label>
//         <input type="email" name="senderEmail" placeholder="Sender Email Address" value={formData.senderEmail} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600'/>
        
//         <label>Sender Home Address</label>
//         <input type="text" name="senderAddress" placeholder="Sender Home Address" value={formData.senderAddress} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />

//         <label>Receiver Name</label>
//         <input type='text' name="recipientName" placeholder="Receiver Name" value={formData.recipientName} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />
        
//         <label>Receiver Email Address</label>
//         <input type="email" name="receiverEmail" placeholder="Receiver Email Address" value={formData.receiverEmail} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />
        
//         <label>Receiver Phone Number</label>
//         <input type="tel" name="recipientPhone" placeholder="Receiver Phone Number" value={formData.recipientPhone} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />
        
//         <label>Receiver Address</label>
//         <input type="text" name="recipientAddress" placeholder="Receiver Home Address" value={formData.recipientAddress} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600'/>
        
//         <label>Weight (kg)</label>
//         <input type="number" name="weight" placeholder="weight (kg)" value={formData.weight} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />
        
//         <label>Length - (Optional)</label>
//         <input type="number" name="length" placeholder="Length" value={formData.length} onChange={handleChange}className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />
        
//         <label>Width - (Optional)</label>
//         <input type="number" name="width" placeholder="Width" value={formData.width} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600'/>
        
//         <label>Height - (Optional)</label>
//         <input type="number" name="height" placeholder="Height" value={formData.height} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />
        
//         <label>Volume - (Optional)</label>
//         <input type="number" name="volume" placeholder="Volume" value={formData.volume} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />
        
//         <label>Shipping Cost (₦) - (Optional)</label>
//         <input type='text' name="cost" placeholder="Shipping cost" value={formData.cost} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />

//         <label>Origin</label>
//         <input type="text" name="origin" placeholder="Origin" value={formData.origin} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />

//         <label>Destination</label>
//         <input type="text" name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />

//         <label>Shipment Type</label>
//         <select name="shipmentType" value={formData.shipmentType} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600'>
//           <option value="">Choose Shipment Type</option>
//           <option value="Boxes">Boxes</option>
//           <option value="Padding">Padding</option>
//           <option value="Package">Package</option>
//           <option value="Document">Document</option>
//           <option value="Other">Other</option>
//         </select>

//         <label>Shipment Pieces</label>
//         <textarea
//           name="shipmentPieces"
//           value={formData.shipmentPieces}
//           onChange={handleChange}
//           placeholder='Enter the Pieces of the shipment'
//           className="w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600">
//         </textarea>

//         <label>Shipment Purpose</label>
//         <select name="shipmentPurpose" value={formData.shipmentPurpose} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600'>
//           <option value="">Choose Shipment Purpose</option>
//           <option value="Personal">Personal</option>
//           <option value="Gift">Gift</option>
//           <option value="Commercial">Commercial</option>
//           <option value="Return for Repair">Return for Repair</option>
//           <option value="Sample">Sample</option>
//           <option value="Other">Other</option>
//         </select>

//         <label>Shipment Facility</label>
//         <select name="shipmentFacility" value={formData.shipmentFacility} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600'>
//           <option value="">Choose Shipment Facility</option>
//           <option value="Lagos">Lagos</option>
//           <option value="Atlanta">Atlanta</option>
//           <option value="Indianapolis">Indianapolis</option>
//           <option value="New York">New York</option>
//           <option value="New Jersey">New Jersey</option>
//           <option value="Maryland">Maryland</option>
//           <option value="Dallas">Dallas</option>
//           <option value="Houston">Houston</option>
//           <option value="United States of America">United States of America</option>
//           <option value="Canada">Canada</option>
//           <option value="Ontario">Ontario</option>
//           <option value="Calgary">Calgary</option>
//           <option value="Edmonton">Edmonton</option>
//           <option value="United Kingdom">United Kingdom</option>
//         </select>
        
//         {/* section for adding items */}
//         <div className="md:col-span-2">
//             <label className="block text-sm font-medium mb-1">Items in Shipment</label>
//             <div className="flex items-center space-x-2 mb-2">
//                 <input
//                   type="text"
//                   value={newItem}
//                   onChange={(e) => setNewItem(e.target.value)}
//                   placeholder="e.g., 'Food Items, Electronics, Clothing etc.'"
//                   className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600'
//                 />
//                 <Button
//                   type="button"
//                   onClick={handleAddItem}
//                   className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center justify-center"
//                 >
//                   <FaPlus />
//                 </Button>
//             </div>

//             {/* Display items from formData state */}
//             {formData.items.length > 0 && (
//                 <ul className="border border-solid border-gray-300 rounded p-2">
//                     {formData.items.map((item, index) => (
//                         <li key={index} className="flex justify-between items-center py-1">
//                             <span>{item}</span>
//                             <Button
//                                 type="button"
//                                 onClick={() => handleRemoveItem(index)}
//                                 className="text-red-600 hover:text-red-800 transition"
//                                 variant="ghost"
//                             >
//                                 <FaTrash />
//                             </Button>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>

//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Shipment Date</label>
//             <Input 
//               type="date" 
//               name="shipmentDate" 
//               value={formData.shipmentDate} 
//               onChange={handleChange} 
//               className="rounded-lg border-gray-300 focus:ring-indigo-500" 
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
//             <Input 
//               type="date" 
//               name="deliveryDate" 
//               value={formData.deliveryDate} 
//               onChange={handleChange} 
//               className="rounded-lg border-gray-300 focus:ring-indigo-500" 
//             />
//           </div>
        
//         <div className='mt-4 flex flex-col'>
//           <label>Notes</label>
//           <textarea name="notes" placeholder="Additional Details" value={formData.notes} onChange={handleChange} className='w-full border border-solid border-green-600 rounded p-2 focus:outline-none focus:ring focus:ring-green-600' />
//           <div className="flex justify-end space-x-2 mt-5">
//             <Button variant="outline" onClick={onClose}>Cancel</Button>
//             <Button variant="outline" onClick={handleSubmit}>Save Changes</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/Api';

export default function EditShipmentModal({ shipment, onClose, onSave, facilities: facilitiesProp }) {
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
    items: [],
    shipmentPieces: '',
    shipmentType: '',
    shipmentPurpose: '',
    shipmentFacility: '',
    shipmentDate: '',
    deliveryDate: '',
  });

  // State for the new item input
  const [newItem, setNewItem] = useState('');
  const [facilities, setFacilities] = useState(facilitiesProp || []);

  useEffect(() => {
    if (shipment) {
      setFormData({
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
        cost: shipment.cost || '',
        items: shipment.items || [],
        shipmentPieces: shipment.shipmentPieces || '',
        shipmentType: shipment.shipmentType || '',
        shipmentPurpose: shipment.shipmentPurpose || '',
        shipmentFacility: shipment.shipmentFacility || '',
        shipmentDate: shipment.shipmentDate ? shipment.shipmentDate.split('T')[0] : '',
        deliveryDate: shipment.deliveryDate ? shipment.deliveryDate.split('T')[0] : '',
      });
    }
  }, [shipment]);

  // Fetch facilities if not provided as prop
  useEffect(() => {
    if (!facilitiesProp || facilitiesProp.length === 0) {
      const fetchFacilities = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/facilities`);
          setFacilities(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error('Error fetching facilities:', err);
        }
      };
      fetchFacilities();
    }
  }, [facilitiesProp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...shipment, ...formData });
    onClose();
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim() !== '') {
      // ✅ Corrected: Update formData state instead of 'form'
      setFormData(prevFormData => ({
        ...prevFormData,
        items: [...prevFormData.items, newItem.trim()]
      }));
      setNewItem('');
    }
  };

  const handleRemoveItem = (index) => {
    // ✅ Corrected: Update formData state instead of 'form'
    setFormData(prevFormData => ({
      ...prevFormData,
      items: prevFormData.items.filter((_, i) => i !== index)
    }));
  };

  return (
  <div className='max-h-[600px] overflow-y-auto'>
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">📋</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Shipment</h2>
          <p className="text-sm text-gray-600">Update shipment details and information</p>
        </div>
      </div>
      
      {/* Sender Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <span className="text-xl">👤</span> Sender Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Input name="senderName" placeholder="Sender Name" value={formData.senderName} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <Input name="senderPhone" placeholder="Sender Phone Number" value={formData.senderPhone} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <Input name="senderEmail" placeholder="Sender Email Address" value={formData.senderEmail} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Home Address</label>
            <Input name="senderAddress" placeholder="Sender Home Address" value={formData.senderAddress} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* Receiver Section */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
          <span className="text-xl">📬</span> Receiver Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Input name="recipientName" placeholder="Receiver Name" value={formData.recipientName} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <Input name="receiverEmail" placeholder="Receiver Email Address" value={formData.receiverEmail} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <Input name="recipientPhone" placeholder="Receiver Phone Number" value={formData.recipientPhone} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Home Address</label>
            <Input name="recipientAddress" placeholder="Receiver Home Address" value={formData.recipientAddress} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-purple-500" />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
          <span className="text-xl">📍</span> Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
            <Input name="origin" placeholder="Origin" value={formData.origin} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
            <Input name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-green-500" />
          </div>
        </div>
      </div>

      {/* Dimensions Section */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
          <span className="text-xl">📦</span> Shipment Dimensions & Weight
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <Input name="weight" placeholder="weight (kg)" value={formData.weight} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
            <Input name="length" placeholder="Length" value={formData.length} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
            <Input name="width" placeholder="Width" value={formData.width} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
            <Input name="height" placeholder="Height" value={formData.height} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
            <Input name="volume" placeholder="Volume" value={formData.volume} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost (₦)</label>
            <Input name="cost" placeholder="Shipping cost" value={formData.cost} onChange={handleChange} className="rounded-lg border-gray-300 focus:ring-orange-500" />
          </div>
        </div>
      </div>

      {/* Shipment Details Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <span className="text-xl">📋</span> Shipment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select name="shipmentType" value={formData.shipmentType} onChange={handleChange} className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
              <option value="">Choose Shipment Type</option>
              <option value="Boxes">Boxes</option>
              <option value="Padding">Padding</option>
              <option value="Package">Package</option>
              <option value="Document">Document</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
            <select name="shipmentPurpose" value={formData.shipmentPurpose} onChange={handleChange} className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
              <option value="">Choose Shipment Purpose</option>
              <option value="Personal">Personal</option>
              <option value="Gift">Gift</option>
              <option value="Commercial">Commercial</option>
              <option value="Return for Repair">Return for Repair</option>
              <option value="Sample">Sample</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Facility</label>
            <select name="shipmentFacility" value={formData.shipmentFacility} onChange={handleChange} className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
              <option value="">Choose Shipment Facility</option>
              {Array.isArray(facilities) && facilities.length > 0 ? (
                facilities.filter(f => f.isActive !== false).map(facility => (
                  <option key={facility._id} value={facility.name}>
                    {facility.name} {facility.city ? `(${facility.city})` : ''}
                  </option>
                ))
              ) : (
                <>
                  <option value="Lagos">Lagos</option>
                  <option value="Atlanta">Atlanta</option>
                  <option value="Indianapolis">Indianapolis</option>
                  <option value="New York">New York</option>
                  <option value="New Jersey">New Jersey</option>
                  <option value="Maryland">Maryland</option>
                  <option value="Dallas">Dallas</option>
                  <option value="Houston">Houston</option>
                  <option value="United States of America">United States of America</option>
                  <option value="Canada">Canada</option>
                  <option value="Ontario">Ontario</option>
                  <option value="Calgary">Calgary</option>
                  <option value="Edmonton">Edmonton</option>
                  <option value="United Kingdom">United Kingdom</option>
                </>
              )}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pieces</label>
            <textarea
              name="shipmentPieces"
              value={formData.shipmentPieces}
              onChange={handleChange}
              placeholder='Enter the Pieces of the shipment'
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows="2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipment Date</label>
            <Input 
              type="date" 
              name="shipmentDate" 
              value={formData.shipmentDate} 
              onChange={handleChange} 
              className="rounded-lg border-gray-300 focus:ring-indigo-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
            <Input 
              type="date" 
              name="deliveryDate" 
              value={formData.deliveryDate} 
              onChange={handleChange} 
              className="rounded-lg border-gray-300 focus:ring-indigo-500" 
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
        <h3 className="text-lg font-semibold text-cyan-900 mb-4 flex items-center gap-2">
          <span className="text-xl">📦</span> Items in Shipment
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="e.g., 'Food Items, Electronics, Clothing etc.'"
            className='flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500'
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="p-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
        {formData.items.length > 0 && (
          <ul className="space-y-2">
            {formData.items.map((item, index) => (
              <li key={index} className="flex justify-between items-center bg-white p-2 rounded-lg border border-cyan-200">
                <span className="text-sm text-gray-700">✓ {item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <FaTrash size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Notes Section */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
        <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <span className="text-xl">📝</span> Additional Notes
        </h3>
        <textarea 
          name="notes" 
          placeholder="Enter any additional details about this shipment..." 
          value={formData.notes} 
          onChange={handleChange} 
          className='w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none' 
          rows="3"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button 
          onClick={onClose} 
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all font-medium"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit} 
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium flex items-center gap-2"
        >
          ✓ Save Changes
        </button>
      </div>
    </div>
  </div>
  );
}

