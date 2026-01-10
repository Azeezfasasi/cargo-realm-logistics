import DashHeader from '@/assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '@/assets/component/DashboardComponents.jsx/DashMenu'
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import { API_BASE_URL } from '@/config/Api'
import { FaSpinner, FaTrash, FaEdit, FaPlus } from 'react-icons/fa'
import BasicModal from '@/components/ui/BasicModal'

export default function ManageShipmentStatus() {
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStatus, setEditingStatus] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    color: '#6B7280',
    category: 'other',
    displayOrder: 0
  })

  const token = localStorage.getItem('token')

  const categories = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'in-transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'failed', label: 'Failed' },
    { value: 'other', label: 'Other' }
  ]

  const colors = [
    { name: 'Gray', value: '#6B7280' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Cyan', value: '#06B6D4' }
  ]

  useEffect(() => {
    fetchStatuses()
  }, [])

  const fetchStatuses = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE_URL}/shipment-statuses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStatuses(res.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching statuses:', err)
      setError(err.response?.data?.message || 'Failed to fetch statuses')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (status = null) => {
    if (status) {
      setEditingStatus(status)
      setFormData(status)
    } else {
      setEditingStatus(null)
      setFormData({
        name: '',
        code: '',
        description: '',
        color: '#6B7280',
        category: 'other',
        displayOrder: 0
      })
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingStatus(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitLoading(true)
      if (editingStatus) {
        await axios.put(
          `${API_BASE_URL}/shipment-statuses/${editingStatus._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setSuccessMessage('Status updated successfully!')
      } else {
        await axios.post(`${API_BASE_URL}/shipment-statuses`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccessMessage('Status created successfully!')
      }
      setTimeout(() => setSuccessMessage(''), 3000)
      handleCloseModal()
      fetchStatuses()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving status')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this status?')) return
    try {
      await axios.delete(`${API_BASE_URL}/shipment-statuses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccessMessage('Status deleted successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      fetchStatuses()
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting status')
    }
  }

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/shipment-statuses/${id}/toggle-active`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccessMessage(`Status ${!currentStatus ? 'activated' : 'deactivated'} successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
      fetchStatuses()
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status')
    }
  }

  const filteredStatuses = statuses.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Helmet>
        <title>Manage Shipment Status - Cargo Realm and Logistics</title>
      </Helmet>
      <DashHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%] p-4 md:p-6'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>Manage Shipment Status</h1>
            <p className='text-gray-600 mt-2'>Create and manage shipment status types</p>
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
              placeholder='Search statuses...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
            />
            <button
              onClick={() => handleOpenModal()}
              className='flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap'
            >
              <FaPlus /> Add Status
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <FaSpinner className='animate-spin text-green-600 text-4xl' />
            </div>
          ) : filteredStatuses.length === 0 ? (
            <div className='text-center py-12 bg-gray-50 rounded-lg'>
              <p className='text-gray-600'>No statuses found. Create your first status to get started.</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse'>
                <thead>
                  <tr className='bg-gray-100 border-b-2 border-gray-300'>
                    <th className='px-6 py-4 text-left font-bold text-gray-900'>Name</th>
                    <th className='px-6 py-4 text-left font-bold text-gray-900'>Code</th>
                    <th className='px-6 py-4 text-left font-bold text-gray-900'>Category</th>
                    <th className='px-6 py-4 text-left font-bold text-gray-900'>Color</th>
                    <th className='px-6 py-4 text-left font-bold text-gray-900'>Status</th>
                    <th className='px-6 py-4 text-center font-bold text-gray-900'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStatuses.map((status, idx) => (
                    <tr
                      key={status._id}
                      className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                    >
                      <td className='px-6 py-4 font-semibold text-gray-900'>{status.name}</td>
                      <td className='px-6 py-4 text-gray-600'>{status.code || '-'}</td>
                      <td className='px-6 py-4'>
                        <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold'>
                          {status.category}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <div
                            className='w-6 h-6 rounded-full border-2 border-gray-300'
                            style={{ backgroundColor: status.color }}
                          />
                          <span className='text-gray-600 text-sm'>{status.color}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            status.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {status.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          <button
                            onClick={() => handleOpenModal(status)}
                            className='p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors'
                            title='Edit'
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleToggleActive(status._id, status.isActive)}
                            className={`p-2 rounded-lg transition-colors ${
                              status.isActive
                                ? 'text-yellow-600 hover:bg-yellow-100'
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={status.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {status.isActive ? '●' : '○'}
                          </button>
                          <button
                            onClick={() => handleDelete(status._id)}
                            className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors'
                            title='Delete'
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal */}
          <BasicModal isOpen={modalOpen} onClose={handleCloseModal}>
            <div className='bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
              <h2 className='text-2xl font-bold mb-6'>
                {editingStatus ? 'Edit Status' : 'Add New Status'}
              </h2>

              <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Name and Code */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Status Name *</label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='e.g., In Transit'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Code</label>
                    <input
                      type='text'
                      name='code'
                      value={formData.code}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='e.g., IN_TRANSIT'
                    />
                  </div>
                </div>

                {/* Category and Display Order */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Category *</label>
                    <select
                      name='category'
                      value={formData.category}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-semibold mb-2'>Display Order</label>
                    <input
                      type='number'
                      name='displayOrder'
                      value={formData.displayOrder}
                      onChange={handleInputChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      placeholder='0'
                    />
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className='block text-sm font-semibold mb-3'>Color</label>
                  <div className='grid grid-cols-4 gap-3'>
                    {colors.map(colorOption => (
                      <button
                        key={colorOption.value}
                        type='button'
                        onClick={() => setFormData(prev => ({ ...prev, color: colorOption.value }))}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          formData.color === colorOption.value
                            ? 'border-gray-900 ring-2 ring-gray-900'
                            : 'border-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <div
                          className='w-8 h-8 rounded-full border-2 border-gray-300'
                          style={{ backgroundColor: colorOption.value }}
                        />
                        <span className='text-xs font-semibold text-gray-600 text-center'>
                          {colorOption.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className='block text-sm font-semibold mb-2'>Description</label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    rows='3'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    placeholder='Description of this status'
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
                        {editingStatus ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingStatus ? 'Update Status' : 'Create Status'
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

