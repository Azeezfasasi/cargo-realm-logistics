import DashHeader from '@/assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '@/assets/component/DashboardComponents.jsx/DashMenu'
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import { API_BASE_URL } from '@/config/Api'
import { FaSpinner, FaTrash, FaEdit, FaPlus } from 'react-icons/fa'
import BasicModal from '@/components/ui/BasicModal'

export default function ManageFacility() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    country: '',
    state: '',
    city: '',
    address: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    capacity: '',
    notes: ''
  })

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchFacilities()
  }, [])

  const fetchFacilities = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE_URL}/facilities`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFacilities(res.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching facilities:', err)
      setError(err.response?.data?.message || 'Failed to fetch facilities')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (facility = null) => {
    if (facility) {
      setEditingFacility(facility)
      setFormData(facility)
    } else {
      setEditingFacility(null)
      setFormData({
        name: '',
        code: '',
        country: '',
        state: '',
        city: '',
        address: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        capacity: '',
        notes: ''
      })
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingFacility(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitLoading(true)
      if (editingFacility) {
        await axios.put(
          `${API_BASE_URL}/facilities/${editingFacility._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setSuccessMessage('Facility updated successfully!')
      } else {
        await axios.post(`${API_BASE_URL}/facilities`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccessMessage('Facility created successfully!')
      }
      setTimeout(() => setSuccessMessage(''), 3000)
      handleCloseModal()
      fetchFacilities()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving facility')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this facility?')) return
    try {
      await axios.delete(`${API_BASE_URL}/facilities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccessMessage('Facility deleted successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      fetchFacilities()
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting facility')
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/facilities/${id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccessMessage(`Facility ${!currentStatus ? 'activated' : 'deactivated'} successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
      fetchFacilities()
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating facility status')
    }
  }

  const filteredFacilities = facilities.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.country?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Helmet>
        <title>Manage Facilities - Cargo Realm and Logistics</title>
      </Helmet>
      <DashHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%] p-4 md:p-6'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>Manage Facilities</h1>
            <p className='text-gray-600 mt-2'>Create, edit, and manage shipping facilities</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className='mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg'>
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
              {error}
            </div>
          )}

          {/* Toolbar */}
          <div className='mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <input
              type='text'
              placeholder='Search facilities...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
            />
            <button
              onClick={() => handleOpenModal()}
              className='flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap'
            >
              <FaPlus /> Add Facility
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <FaSpinner className='animate-spin text-green-600 text-4xl' />
            </div>
          ) : filteredFacilities.length === 0 ? (
            <div className='text-center py-12 bg-gray-50 rounded-lg'>
              <p className='text-gray-600'>No facilities found. Create your first facility to get started.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredFacilities.map(facility => (
                <div
                  key={facility._id}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    facility.isActive
                      ? 'bg-white border-green-200 hover:shadow-lg'
                      : 'bg-gray-50 border-gray-200 opacity-75'
                  }`}
                >
                  {/* Status Badge */}
                  <div className='flex justify-between items-start mb-4'>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        facility.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {facility.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Facility Name */}
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>{facility.name}</h3>

                  {/* Location Info */}
                  <div className='space-y-2 mb-4 text-sm text-gray-600'>
                    {facility.city && facility.state && (
                      <p>📍 {facility.city}, {facility.state}</p>
                    )}
                    {facility.country && (
                      <p>🌍 {facility.country}</p>
                    )}
                    {facility.contactPerson && (
                      <p>👤 {facility.contactPerson}</p>
                    )}
                    {facility.contactPhone && (
                      <p>📞 {facility.contactPhone}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2 pt-4 border-t'>
                    <button
                      onClick={() => handleOpenModal(facility)}
                      className='flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold'
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(facility._id, facility.isActive)}
                      className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-semibold text-white ${
                        facility.isActive
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {facility.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(facility._id)}
                      className='flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold'
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          <BasicModal isOpen={modalOpen} onClose={handleCloseModal}>
            <div className='bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
              <h2 className='text-2xl font-bold mb-6'>
                {editingFacility ? 'Edit Facility' : 'Add New Facility'}
              </h2>

              <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Name and Code */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Facility Name *</label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='e.g., Atlanta Hub'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Facility Code</label>
                    <input
                      type='text'
                      name='code'
                      value={formData.code}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='e.g., ATL'
                    />
                  </div>
                </div>

                {/* Location */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Country *</label>
                    <input
                      type='text'
                      name='country'
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='e.g., United States'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>State/Province</label>
                    <input
                      type='text'
                      name='state'
                      value={formData.state}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='e.g., Georgia'
                    />
                  </div>
                </div>

                {/* City and Address */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>City</label>
                    <input
                      type='text'
                      name='city'
                      value={formData.city}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='e.g., Atlanta'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Address</label>
                    <input
                      type='text'
                      name='address'
                      value={formData.address}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='Full address'
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Contact Person</label>
                    <input
                      type='text'
                      name='contactPerson'
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='Name'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Phone</label>
                    <input
                      type='tel'
                      name='contactPhone'
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='Phone number'
                    />
                  </div>
                </div>

                {/* Email and Capacity */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Email</label>
                    <input
                      type='email'
                      name='contactEmail'
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='Email address'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Capacity (m³)</label>
                    <input
                      type='number'
                      name='capacity'
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='Storage capacity'
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className='block text-sm font-semibold mb-2'>Notes</label>
                  <textarea
                    name='notes'
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows='3'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    placeholder='Additional information'
                  />
                </div>

                {/* Submit Buttons */}
                <div className='flex gap-3 pt-6 border-t'>
                  <button
                    type='submit'
                    disabled={submitLoading}
                    className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      submitLoading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {submitLoading ? (
                      <>
                        <FaSpinner className='animate-spin' />
                        {editingFacility ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingFacility ? 'Update Facility' : 'Create Facility'
                    )}
                  </button>
                  <button
                    type='button'
                    onClick={handleCloseModal}
                    disabled={submitLoading}
                    className='flex-1 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </BasicModal>
        </div>
      </div>
    </>
  )
}

