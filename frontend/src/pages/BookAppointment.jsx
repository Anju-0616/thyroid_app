// src/pages/BookAppointment.jsx
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { bookAppointment } from '../services/api'

function BookAppointment() {
  const location = useLocation()
  const navigate = useNavigate()
  const doctor = location.state?.doctor

  const [formData, setFormData] = useState({ date: '', time: '', reason: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(null)

  if (!doctor) {
    return (
      <div className='min-h-screen bg-blue-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-500 mb-4'>No doctor selected.</p>
          <button onClick={() => navigate('/doctors')}
            className='bg-blue-600 text-white px-6 py-2 rounded-xl text-sm'>
            Browse Doctors
          </button>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await bookAppointment(
        doctor.id,
        formData.date,
        formData.time,
        formData.reason
      )
      setConfirmed(data.appointment)
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Confirmation screen
  if (confirmed) {
    return (
      <div className='min-h-screen bg-blue-50 flex items-center justify-center px-4'>
        <div className='bg-white rounded-2xl border border-green-200 p-8 w-full max-w-md text-center shadow-sm'>
          <div className='text-5xl mb-4'>✅</div>
          <h2 className='text-2xl font-bold text-green-700 mb-1'>Appointment Confirmed!</h2>
          <p className='text-gray-500 text-sm mb-6'>
            A confirmation email has been sent to your inbox.
          </p>

          <div className='bg-green-50 rounded-xl p-5 text-left space-y-3 text-sm mb-6'>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Doctor</span>
              <span className='font-medium text-gray-800'>{confirmed.doctor_name}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Specialty</span>
              <span className='font-medium text-gray-800'>{confirmed.doctor_specialization}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Date</span>
              <span className='font-medium text-gray-800'>{confirmed.date}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Time</span>
              <span className='font-medium text-gray-800'>{confirmed.time}</span>
            </div>
            {confirmed.reason && (
              <div className='flex justify-between'>
                <span className='text-gray-500'>Reason</span>
                <span className='font-medium text-gray-800'>{confirmed.reason}</span>
              </div>
            )}
            <div className='flex justify-between'>
              <span className='text-gray-500'>Status</span>
              <span className='font-medium text-green-600 capitalize'>{confirmed.status}</span>
            </div>
          </div>

          <div className='flex gap-3'>
            <button onClick={() => navigate('/doctors')}
              className='flex-1 border border-blue-200 text-blue-600 py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors'>
              Back to Doctors
            </button>
            <button onClick={() => navigate('/dashboard')}
              className='flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors'>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Booking form
  return (
    <div className='min-h-screen bg-blue-50 py-10 px-4'>
      <div className='max-w-lg mx-auto'>

        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-blue-700'>Book Appointment 📅</h1>
          <p className='text-gray-500 text-sm mt-1'>Fill in the details below to confirm your slot.</p>
        </div>

        {/* Doctor info card */}
        <div className='bg-white rounded-2xl border border-blue-100 p-5 mb-6 flex items-center gap-4'>
          <div className='w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0'>
            🧑‍⚕️
          </div>
          <div>
            <p className='font-bold text-gray-800'>{doctor.name}</p>
            <p className='text-blue-600 text-sm'>{doctor.specialization}</p>
            {doctor.location && <p className='text-gray-400 text-xs mt-0.5'>📍 {doctor.location}</p>}
            {doctor.available_days && <p className='text-gray-400 text-xs'>📅 {doctor.available_days}</p>}
          </div>
        </div>

        {error && (
          <div className='bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm mb-4'>{error}</div>
        )}

        <div className='bg-white rounded-2xl border border-blue-100 p-6 shadow-sm'>
          <form onSubmit={handleSubmit} className='space-y-5'>

            <div>
              <label className='text-sm font-medium text-gray-700'>Date</label>
              <input
                type='date'
                name='date'
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm'
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700'>Time</label>
              <input
                type='time'
                name='time'
                value={formData.time}
                onChange={handleChange}
                required
                className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm'
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700'>
                Reason for visit
                <span className='text-gray-400 font-normal ml-1'>(optional)</span>
              </label>
              <textarea
                name='reason'
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                placeholder='e.g. Routine thyroid checkup, follow-up after medication...'
                className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3
                         rounded-xl font-medium transition-colors disabled:opacity-50'
            >
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>

          </form>
        </div>

      </div>
    </div>
  )
}

export default BookAppointment