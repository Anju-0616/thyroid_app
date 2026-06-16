// src/pages/admin/AdminDoctors.jsx
import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminGetDoctors, adminAddDoctor, adminDeleteDoctor, adminGetDoctorAppointments } from '../../services/adminApi'

const EMPTY_FORM = { name: '', specialization: '', email: '', phone: '', location: '', available_days: '' }

export default function AdminDoctors({ onAuthChange }) {
  const [doctors, setDoctors]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [showForm, setShowForm]         = useState(false)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [saving, setSaving]             = useState(false)
  const [selected, setSelected]         = useState(null)
  const [appointments, setAppointments] = useState([])
  const [apptLoading, setApptLoading]   = useState(false)
  const [error, setError]               = useState('')
  const [formError, setFormError]       = useState('')
  const [search, setSearch]             = useState('')

  const load = () => {
    setLoading(true)
    adminGetDoctors()
      .then(setDoctors)
      .catch(() => setError('Failed to load doctors'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openDoctor = async (doctor) => {
    setSelected(doctor)
    setApptLoading(true)
    try {
      const data = await adminGetDoctorAppointments(doctor.id)
      setAppointments(data)
    } catch {
      setAppointments([])
    } finally {
      setApptLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const added = await adminAddDoctor(form)
      setDoctors(prev => [...prev, added])
      setForm(EMPTY_FORM)
      setShowForm(false)
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor? Their appointments will also be removed.')) return
    try {
      await adminDeleteDoctor(id)
      setDoctors(prev => prev.filter(d => d.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch (e) {
      setError(e.message)
    }
  }

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title='Doctors' onAuthChange={onAuthChange}>

      <div className='mb-6 flex items-start justify-between gap-4 flex-wrap'>
        <div>
          <h2 className='text-2xl font-bold text-gray-800'>Manage Doctors 🩺</h2>
          <p className='text-gray-400 text-sm mt-1'>Add, remove doctors and view their booked appointments.</p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>🔍</span>
            <input
              type='text'
              placeholder='Search doctors...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-violet-300 w-52'
            />
          </div>
          <button
            onClick={() => { setShowForm(true); setFormError('') }}
            className='bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5
                       rounded-xl text-sm font-medium transition-colors flex items-center gap-2'
          >
            ＋ Add Doctor
          </button>
        </div>
      </div>

      {error && <div className='bg-red-50 text-red-500 text-sm rounded-xl px-4 py-3 mb-4'>{error}</div>}

      {/* Add Doctor Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-lg'>
            <div className='px-6 py-5 border-b border-gray-100 flex items-center justify-between'>
              <h3 className='font-semibold text-gray-800'>Add New Doctor</h3>
              <button onClick={() => setShowForm(false)}
                className='text-gray-400 hover:text-gray-600 text-xl font-light'>✕</button>
            </div>
            <form onSubmit={handleAdd} className='p-6 space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                {[
                  ['name',           'Full Name *',        'Dr. Priya Sharma',          'text' ],
                  ['specialization', 'Specialization *',   'Endocrinologist',            'text' ],
                  ['email',          'Email *',            'priya@hospital.com',         'email'],
                  ['phone',          'Phone',              '+91-9876543210',             'tel'  ],
                  ['location',       'Location',           'Apollo Hospital, Bangalore', 'text' ],
                  ['available_days', 'Available Days',     'Mon, Wed, Fri',              'text' ],
                ].map(([field, label, placeholder, type]) => (
                  <div key={field} className={field === 'location' || field === 'available_days' ? 'col-span-2' : ''}>
                    <label className='text-xs font-medium text-gray-600 mb-1 block'>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      required={label.includes('*')}
                      className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-violet-300'
                    />
                  </div>
                ))}
              </div>
              {formError && <div className='bg-red-50 text-red-500 text-sm rounded-xl px-4 py-3'>{formError}</div>}
              <div className='flex gap-3 pt-2'>
                <button type='button' onClick={() => setShowForm(false)}
                  className='flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm
                             font-medium hover:bg-gray-50 transition-colors'>
                  Cancel
                </button>
                <button type='submit' disabled={saving}
                  className='flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl
                             text-sm font-medium transition-colors disabled:opacity-50'>
                  {saving ? 'Adding...' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctors Grid */}
      {loading ? (
        <div className='text-center text-gray-400 py-16'>Loading doctors...</div>
      ) : filtered.length === 0 ? (
        <div className='bg-white rounded-2xl border border-gray-100 p-12 text-center'>
          <p className='text-4xl mb-3'>🩺</p>
          <p className='text-gray-600 font-medium'>No doctors found</p>
          <p className='text-gray-400 text-sm mt-1'>Add a doctor to get started.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          {filtered.map(d => (
            <div key={d.id}
              className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow'>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-violet-100 flex items-center
                                  justify-center text-violet-700 font-bold text-base flex-shrink-0'>
                    {d.name?.charAt(0)}
                  </div>
                  <div>
                    <p className='font-semibold text-gray-800 text-sm'>{d.name}</p>
                    <p className='text-xs text-violet-600 font-medium'>{d.specialization}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(d.id)}
                  className='text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors'
                  title='Delete doctor'>
                  🗑️
                </button>
              </div>
              <div className='space-y-1.5 mb-4'>
                {d.email        && <p className='text-xs text-gray-500'>📧 {d.email}</p>}
                {d.phone        && <p className='text-xs text-gray-500'>📞 {d.phone}</p>}
                {d.location     && <p className='text-xs text-gray-500'>📍 {d.location}</p>}
                {d.available_days && <p className='text-xs text-gray-500'>🗓️ {d.available_days}</p>}
              </div>
              <button onClick={() => openDoctor(d)}
                className='w-full bg-violet-50 hover:bg-violet-100 text-violet-700 py-2 rounded-xl
                           text-sm font-medium transition-colors'>
                View Appointments
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Appointments Modal */}
      {selected && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col'>
            <div className='px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0'>
              <div>
                <h3 className='font-semibold text-gray-800'>{selected.name}</h3>
                <p className='text-xs text-violet-600'>{selected.specialization}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className='text-gray-400 hover:text-gray-600 text-xl font-light'>✕</button>
            </div>
            <div className='px-6 py-4 border-b border-gray-50 grid grid-cols-2 gap-3 flex-shrink-0'>
              {[
                ['📧 Email',    selected.email],
                ['📞 Phone',    selected.phone || '—'],
                ['📍 Location', selected.location || '—'],
                ['🗓️ Days',     selected.available_days || '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className='text-xs text-gray-400'>{label}</p>
                  <p className='text-sm font-medium text-gray-700 mt-0.5'>{value}</p>
                </div>
              ))}
            </div>
            <div className='flex-1 overflow-y-auto'>
              <div className='px-6 py-3 border-b border-gray-100 flex items-center justify-between'>
                <h4 className='font-semibold text-gray-700 text-sm'>Booked Appointments</h4>
                <span className='text-xs text-gray-400'>{appointments.length} total</span>
              </div>
              {apptLoading ? (
                <div className='text-center text-gray-400 py-8 text-sm'>Loading appointments...</div>
              ) : appointments.length === 0 ? (
                <div className='text-center text-gray-400 py-8'>
                  <p className='text-2xl mb-2'>📅</p>
                  <p className='text-sm'>No appointments booked yet</p>
                </div>
              ) : (
                <div className='divide-y divide-gray-50'>
                  {appointments.map(a => (
                    <div key={a.id} className='px-6 py-3'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium text-gray-800'>{a.user_name || 'Patient'}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          a.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                          a.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                          'bg-yellow-50 text-yellow-600'
                        }`}>{a.status}</span>
                      </div>
                      <p className='text-xs text-gray-400 mt-0.5'>
                        {a.date} at {a.time}{a.reason && ` · ${a.reason}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='px-6 py-4 border-t border-gray-100 flex-shrink-0'>
              <button onClick={() => handleDelete(selected.id)}
                className='w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl
                           text-sm font-medium transition-colors'>
                🗑️ Remove Doctor
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}