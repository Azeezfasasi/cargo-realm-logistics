import DashHeader from '@/assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '@/assets/component/DashboardComponents.jsx/DashMenu'
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet';
import { API_BASE_URL } from '@/config/Api';

export default function ManageMessageSlides() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    isActive: true,
  })

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/messageslides`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data.data || [])
    } catch (err) {
      setErrorMessage('Failed to load messages')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const url = editingId
        ? `${API_BASE_URL}/messageslides/${editingId}`
        : `${API_BASE_URL}/messageslides`
      
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save message')
      
      setSuccessMessage(editingId ? 'Message updated successfully!' : 'Message created successfully!')
      resetForm()
      fetchMessages()
      
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setErrorMessage('Failed to save message')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (message) => {
    setFormData({
      title: message.title,
      message: message.message,
      isActive: message.isActive,
    })
    setEditingId(message._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/messageslides/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete message')
      
      setSuccessMessage('Message deleted successfully!')
      fetchMessages()
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setErrorMessage('Failed to delete message')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ title: '', message: '', isActive: true })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredMessages = messages.filter(msg =>
    msg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Helmet>
        <title>Manage Message Slides - Cargo Realm and Logistics</title>
      </Helmet>
      <DashHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%] p-4 lg:p-6'>
          <div className='space-y-6'>
            {/* Header Section */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>Manage Message Slides</h1>
                <p className='text-gray-600 mt-1'>Create, edit, and manage cargo shipment messages</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors'
              >
                {showForm ? 'Cancel' : '+ New Message'}
              </button>
            </div>

            {/* Alert Messages */}
            {successMessage && (
              <div className='p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3'>
                <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                <p className='text-green-700'>{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className='p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3'>
                <div className='w-2 h-2 bg-red-600 rounded-full'></div>
                <p className='text-red-700'>{errorMessage}</p>
              </div>
            )}

            {/* Form Section */}
            {showForm && (
              <div className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  {editingId ? 'Edit Message' : 'Create New Message'}
                </h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Message Title
                    </label>
                    <input
                      type='text'
                      name='title'
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder='e.g., Shipment in Transit'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Message Content
                    </label>
                    <textarea
                      name='message'
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder='Enter the message content here...'
                      rows='4'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none'
                    ></textarea>
                  </div>

                  <div className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      id='isActive'
                      name='isActive'
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className='w-4 h-4 accent-blue-600'
                    />
                    <label htmlFor='isActive' className='text-sm font-medium text-gray-700'>
                      Active (Display on homepage)
                    </label>
                  </div>

                  <div className='flex gap-3 pt-4'>
                    <button
                      type='submit'
                      disabled={loading}
                      className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors'
                    >
                      {loading ? 'Saving...' : editingId ? 'Update Message' : 'Create Message'}
                    </button>
                    <button
                      type='button'
                      onClick={resetForm}
                      className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Search Section */}
            {messages.length > 0 && (
              <div>
                <input
                  type='text'
                  placeholder='Search messages...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                />
              </div>
            )}

            {/* Messages List */}
            {loading && !showForm ? (
              <div className='flex items-center justify-center py-12'>
                <div className='text-gray-500'>Loading messages...</div>
              </div>
            ) : filteredMessages.length > 0 ? (
              <div className='grid gap-4 md:grid-cols-2'>
                {filteredMessages.map((message) => (
                  <div
                    key={message._id}
                    className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900'>{message.title}</h3>
                        <div className='flex items-center gap-2 mt-1'>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                            message.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {message.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className='text-gray-600 text-sm line-clamp-2 mb-4'>{message.message}</p>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEdit(message)}
                        className='flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-sm rounded-lg transition-colors'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(message._id)}
                        className='flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm rounded-lg transition-colors'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12 bg-gray-50 rounded-lg'>
                <p className='text-gray-500 text-lg'>
                  {searchTerm ? 'No messages found matching your search.' : 'No messages yet. Create your first message!'}
                </p>
              </div>
            )}

            {/* Stats Footer */}
            {messages.length > 0 && (
              <div className='flex flex-wrap gap-4 pt-6 border-t border-gray-200'>
                <div className='flex-1 min-w-[150px]'>
                  <p className='text-sm text-gray-600'>Total Messages</p>
                  <p className='text-2xl font-bold text-gray-900'>{messages.length}</p>
                </div>
                <div className='flex-1 min-w-[150px]'>
                  <p className='text-sm text-gray-600'>Active Messages</p>
                  <p className='text-2xl font-bold text-green-600'>{messages.filter(m => m.isActive).length}</p>
                </div>
                <div className='flex-1 min-w-[150px]'>
                  <p className='text-sm text-gray-600'>Inactive Messages</p>
                  <p className='text-2xl font-bold text-gray-600'>{messages.filter(m => !m.isActive).length}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
