import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { bookAppointment } from '../services/api'

export default function BookAppointment({ onAuthChange }) {
  const location = useLocation()
  const navigate = useNavigate()
  const doctor = location.state?.doctor
  const [formData, setFormData] = useState({ date: '', time: '', reason: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(null)

  if (!doctor) return (
    <Layout title='Book Appointment' onAuthChange={onAuthChange}>
      <div className='text-center py-20'>
        <p className='text-gray-400 mb-4'>No doctor selected.</p>
        <button onClick={() => navigate('/doctors')}
          className='bg-violet-600 text-white px-6 py-2 rounded-xl text-sm'>
          Browse Doctors
        </button>
      </div>
    </Layout>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await bookAppointment(doctor.id, formData.date, formData.time, formData.reason)
      setConfirmed(data.appointment)
    } catch (err) {
      setError(err.message || 'Booking failed.')
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) return (
    <Layout title='Appointment Confirmed' onAuthChange={onAuthChange}>
      <div className='max-w-md mx-auto bg-white rounded-2xl border border-green-200 p-8 text-center shadow-sm'>
        <div className='text-5xl mb-4'>✅</div>
        <h2 className='text-2xl font-bold text-green-700 mb-1'>Appointment Confirmed!</h2>
        <p className='text-gray-400 text-sm mb-6'>A confirmation email has been sent to your inbox.</p>
        <div className='bg-green-50 rounded-xl p-5 text-left space-y-3 text-sm mb-6'>
          {[
            ['Doctor', confirmed.doctor_name],
            ['Specialty', confirmed.doctor_specialization],
            ['Date', confirmed.date],
            ['Time', confirmed.time],
            confirmed.reason && ['Reason', confirmed.reason],
            ['Status', confirmed.status],
          ].filter(Boolean).map(([label, val]) => (
            <div key={label} className='flex justify-between'>
              <span className='text-gray-400'>{label}</span>
              <span className='font-medium text-gray-800 capitalize'>{val}</span>
            </div>
          ))}
        </div>
        <div className='flex gap-3'>
          <button onClick={() => navigate('/doctors')}
            className='flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50'>
            Back to Doctors
          </button>
          <button onClick={() => navigate('/dashboard')}
            className='flex-1 bg-violet-600 text-white py-2 rounded-xl text-sm hover:bg-violet-700'>
            Dashboard
          </button>
        </div>
      </div>
    </Layout>
  )

  return (
    <Layout title='Book Appointment' onAuthChange={onAuthChange}>
      <div className='max-w-lg'>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Book Appointment 📅</h2>
          <p className='text-gray-400 text-sm mt-1'>Fill in the details to confirm your slot.</p>
        </div>

        <div className='bg-white rounded-2xl border border-gray-100 p-5 mb-5 flex items-center gap-4 shadow-sm'>
          <div className='w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-xl'>🧑‍⚕️</div>
          <div>
            <p className='font-bold text-gray-800'>{doctor.name}</p>
            <p className='text-violet-600 text-sm'>{doctor.specialization}</p>
            {doctor.location && <p className='text-gray-400 text-xs mt-0.5'>📍 {doctor.location}</p>}
          </div>
        </div>

        {error && <div className='bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm mb-4'>{error}</div>}

        <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {[
              { label: 'Date', name: 'date', type: 'date', extra: { min: new Date().toISOString().split('T')[0] } },
              { label: 'Time', name: 'time', type: 'time' },
            ].map(({ label, name, type, extra }) => (
              <div key={name}>
                <label className='text-sm font-medium text-gray-700'>{label}</label>
                <input type={type} name={name} value={formData[name]} required {...extra}
                  onChange={e => setFormData({ ...formData, [name]: e.target.value })}
                  className='w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm' />
              </div>
            ))}
            <div>
              <label className='text-sm font-medium text-gray-700'>
                Reason <span className='text-gray-400 font-normal'>(optional)</span>
              </label>
              <textarea name='reason' rows={3} value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                placeholder='e.g. Routine checkup, follow-up after medication...'
                className='w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm resize-none' />
            </div>
            <button type='submit' disabled={loading}
              className='w-full bg-violet-600 hover:bg-violet-700 text-white py-3
                         rounded-xl font-medium transition-colors disabled:opacity-50'>
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}