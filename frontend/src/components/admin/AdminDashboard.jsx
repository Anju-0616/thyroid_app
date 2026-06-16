// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminGetUsers, adminGetDoctors, adminGetAllAppointments } from '../../services/adminApi'

export default function AdminDashboard({ onAuthChange }) {
  const [users, setUsers] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminGetUsers(), adminGetDoctors(), adminGetAllAppointments()])
      .then(([u, d, a]) => { setUsers(u); setDoctors(d); setAppointments(a) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const confirmed = appointments.filter(a => a.status === 'confirmed').length
  const pending   = appointments.filter(a => a.status === 'pending').length
  const verified  = users.filter(u => u.is_verified).length

  const stats = [
    { label: 'Total Users',    value: users.length,        icon: '👥', color: 'bg-blue-50 border-blue-200 text-blue-700'      },
    { label: 'Verified Users', value: verified,            icon: '✅', color: 'bg-green-50 border-green-200 text-green-700'   },
    { label: 'Total Doctors',  value: doctors.length,      icon: '🩺', color: 'bg-violet-50 border-violet-200 text-violet-700' },
    { label: 'Appointments',   value: appointments.length, icon: '📅', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  ]

  const recentUsers        = [...users].slice(0, 5)
  const recentAppointments = [...appointments].slice(0, 5)

  return (
    <AdminLayout title='Dashboard' onAuthChange={onAuthChange}>

      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>Admin Dashboard 🏠</h2>
        <p className='text-gray-400 text-sm mt-1'>Overview of all platform activity.</p>
      </div>

      {loading ? (
        <div className='text-center text-gray-400 py-16'>Loading...</div>
      ) : (
        <>
          {/* Stats */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
            {stats.map(({ label, value, icon, color }) => (
              <div key={label} className={`rounded-2xl border p-5 ${color}`}>
                <p className='text-3xl mb-1'>{icon}</p>
                <p className='text-3xl font-bold'>{value}</p>
                <p className='text-sm font-medium mt-1 opacity-80'>{label}</p>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

            {/* Recent Users */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm'>
              <div className='px-6 py-4 border-b border-gray-100 flex items-center justify-between'>
                <h3 className='font-semibold text-gray-700'>Recent Users</h3>
                <span className='text-xs text-gray-400'>Last 5 registered</span>
              </div>
              <div className='divide-y divide-gray-50'>
                {recentUsers.length === 0 && (
                  <p className='text-gray-400 text-sm text-center py-6'>No users yet</p>
                )}
                {recentUsers.map(u => (
                  <div key={u.id} className='flex items-center gap-3 px-6 py-3'>
                    <div className='w-8 h-8 rounded-full bg-violet-100 flex items-center
                                    justify-center text-violet-700 font-bold text-sm flex-shrink-0'>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-800 truncate'>{u.name}</p>
                      <p className='text-xs text-gray-400 truncate'>{u.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                      u.is_verified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {u.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Appointments */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm'>
              <div className='px-6 py-4 border-b border-gray-100 flex items-center justify-between'>
                <h3 className='font-semibold text-gray-700'>Recent Appointments</h3>
                <div className='flex gap-3 text-xs text-gray-400'>
                  <span>✅ {confirmed} confirmed</span>
                  <span>⏳ {pending} pending</span>
                </div>
              </div>
              <div className='divide-y divide-gray-50'>
                {recentAppointments.length === 0 && (
                  <p className='text-gray-400 text-sm text-center py-6'>No appointments yet</p>
                )}
                {recentAppointments.map(a => (
                  <div key={a.id} className='px-6 py-3'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-medium text-gray-800'>{a.user_name || 'User'}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        a.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                        a.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                        'bg-yellow-50 text-yellow-600'
                      }`}>{a.status}</span>
                    </div>
                    <p className='text-xs text-gray-400 mt-0.5'>
                      {a.doctor_name} · {a.date} at {a.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}
    </AdminLayout>
  )
}