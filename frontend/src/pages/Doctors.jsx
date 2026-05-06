import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getDoctors } from '../services/api'

export default function Doctors({ onAuthChange }) {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title='Doctors' onAuthChange={onAuthChange}>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>Find a Doctor 🩺</h2>
        <p className='text-gray-400 text-sm mt-1'>
          Browse endocrinologists and book an appointment.
        </p>
      </div>

      {loading && <div className='text-center text-gray-400 py-16'>Loading doctors...</div>}
      {error && <div className='bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm'>{error}</div>}

      {!loading && !error && doctors.length === 0 && (
        <div className='bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm'>
          <p className='text-5xl mb-4'>🩺</p>
          <p className='text-gray-600 font-medium'>No doctors listed yet.</p>
          <p className='text-gray-400 text-sm mt-1'>Check back soon.</p>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {doctors.map(doctor => (
          <div key={doctor.id}
            className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm
                       hover:shadow-md transition-shadow'>
            <div className='flex items-start gap-4 mb-4'>
              <div className='w-12 h-12 rounded-full bg-violet-100 flex items-center
                              justify-center text-xl flex-shrink-0'>
                🧑‍⚕️
              </div>
              <div>
                <h3 className='font-bold text-gray-800'>{doctor.name}</h3>
                <p className='text-violet-600 text-sm font-medium'>{doctor.specialization}</p>
              </div>
            </div>

            <div className='space-y-1.5 text-sm text-gray-500 mb-5'>
              {doctor.location    && <p>📍 {doctor.location}</p>}
              {doctor.phone       && <p>📞 {doctor.phone}</p>}
              {doctor.email       && <p>✉️ {doctor.email}</p>}
              {doctor.available_days && <p>📅 {doctor.available_days}</p>}
            </div>

            <button
              onClick={() => navigate('/book-appointment', { state: { doctor } })}
              className='w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5
                         rounded-xl text-sm font-medium transition-colors'
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </Layout>
  )
}