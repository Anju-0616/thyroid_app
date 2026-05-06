// src/pages/Doctors.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDoctors } from '../services/api'

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getDoctors()
      .then(data => setDoctors(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className='min-h-screen bg-blue-50 py-10 px-4'>
      <div className='max-w-4xl mx-auto'>

        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-blue-700'>Find a Doctor 🩺</h1>
          <p className='text-gray-500 text-sm mt-1'>
            Browse our list of endocrinologists and book an appointment.
          </p>
        </div>

        {loading && (
          <div className='text-center text-gray-400 py-12'>Loading doctors...</div>
        )}

        {error && (
          <div className='bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm'>{error}</div>
        )}

        {!loading && !error && doctors.length === 0 && (
          <div className='bg-white rounded-2xl border border-blue-100 p-10 text-center'>
            <p className='text-4xl mb-3'>🩺</p>
            <p className='text-gray-600 font-medium'>No doctors listed yet.</p>
            <p className='text-gray-400 text-sm mt-1'>Check back soon.</p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {doctors.map(doctor => (
            <div key={doctor.id}
              className='bg-white rounded-2xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow'>

              <div className='flex items-start gap-4'>
                <div className='w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0'>
                  🧑‍⚕️
                </div>
                <div className='flex-1'>
                  <h2 className='text-lg font-bold text-gray-800'>{doctor.name}</h2>
                  <p className='text-blue-600 text-sm font-medium'>{doctor.specialization}</p>
                </div>
              </div>

              <div className='mt-4 space-y-2 text-sm text-gray-600'>
                {doctor.location && (
                  <div className='flex items-center gap-2'>
                    <span>📍</span>
                    <span>{doctor.location}</span>
                  </div>
                )}
                {doctor.phone && (
                  <div className='flex items-center gap-2'>
                    <span>📞</span>
                    <span>{doctor.phone}</span>
                  </div>
                )}
                {doctor.email && (
                  <div className='flex items-center gap-2'>
                    <span>✉️</span>
                    <span>{doctor.email}</span>
                  </div>
                )}
                {doctor.available_days && (
                  <div className='flex items-center gap-2'>
                    <span>📅</span>
                    <span>{doctor.available_days}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/book-appointment', { state: { doctor } })}
                className='mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white
                           py-2 rounded-xl text-sm font-medium transition-colors'
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Doctors