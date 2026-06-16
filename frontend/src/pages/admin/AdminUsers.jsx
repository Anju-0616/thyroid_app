// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminGetUsers, adminDeleteUser } from '../../services/adminApi'

export default function AdminUsers({ onAuthChange }) {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)
  const [error, setError]       = useState('')

  const load = () => {
    setLoading(true)
    adminGetUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return
    try {
      await adminDeleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <AdminLayout title='Users' onAuthChange={onAuthChange}>

      <div className='mb-6 flex items-start justify-between gap-4 flex-wrap'>
        <div>
          <h2 className='text-2xl font-bold text-gray-800'>Manage Users 👥</h2>
          <p className='text-gray-400 text-sm mt-1'>View and manage all registered user accounts.</p>
        </div>
        <div className='relative'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>🔍</span>
          <input
            type='text'
            placeholder='Search by name or email...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm
                       focus:outline-none focus:ring-2 focus:ring-violet-300 w-64'
          />
        </div>
      </div>

      {error && <div className='bg-red-50 text-red-500 text-sm rounded-xl px-4 py-3 mb-4'>{error}</div>}

      {loading ? (
        <div className='text-center text-gray-400 py-16'>Loading users...</div>
      ) : (
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
          <div className='px-6 py-3 bg-gray-50 border-b border-gray-100 grid grid-cols-12 gap-4
                          text-xs font-semibold text-gray-500 uppercase tracking-wide'>
            <span className='col-span-1'>#</span>
            <span className='col-span-3'>Name</span>
            <span className='col-span-4'>Email</span>
            <span className='col-span-2'>Status</span>
            <span className='col-span-2'>Joined</span>
          </div>

          {filtered.length === 0 && (
            <div className='text-center text-gray-400 py-12'>No users found.</div>
          )}

          {filtered.map((u, i) => (
            <div key={u.id}
              className='grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50
                         hover:bg-gray-50 transition-colors items-center'>
              <span className='col-span-1 text-xs text-gray-400 font-mono'>{i + 1}</span>

              <div className='col-span-3 flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-violet-100 flex items-center
                                justify-center text-violet-700 font-bold text-sm flex-shrink-0'>
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <p className='text-sm font-medium text-gray-800 truncate'>{u.name}</p>
              </div>

              <span className='col-span-4 text-sm text-gray-500 truncate'>{u.email}</span>

              <span className={`col-span-2 text-xs px-2.5 py-1 rounded-full font-medium w-fit ${
                u.is_verified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
              }`}>
                {u.is_verified ? '✅ Verified' : '⏳ Unverified'}
              </span>

              <div className='col-span-2 flex items-center justify-between gap-2'>
                <span className='text-xs text-gray-400'>
                  {new Date(u.created_at).toLocaleDateString('en-IN')}
                </span>
                <div className='flex items-center gap-1'>
                  <button
                    onClick={() => setSelected(u)}
                    className='text-xs px-2.5 py-1.5 rounded-lg bg-violet-50 text-violet-600
                               hover:bg-violet-100 transition-colors font-medium'
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className='text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500
                               hover:bg-red-100 transition-colors font-medium'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className='px-6 py-3 bg-gray-50 text-xs text-gray-400'>
            Showing {filtered.length} of {users.length} users
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selected && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-md'>
            <div className='px-6 py-5 border-b border-gray-100 flex items-center justify-between'>
              <h3 className='font-semibold text-gray-800'>User Details</h3>
              <button onClick={() => setSelected(null)}
                className='text-gray-400 hover:text-gray-600 text-xl font-light'>✕</button>
            </div>
            <div className='p-6 space-y-4'>
              <div className='flex items-center gap-4'>
                <div className='w-14 h-14 rounded-full bg-violet-100 flex items-center
                                justify-center text-2xl font-bold text-violet-600'>
                  {selected.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className='font-bold text-gray-800 text-lg'>{selected.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selected.is_verified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {selected.is_verified ? '✅ Verified' : '⏳ Unverified'}
                  </span>
                </div>
              </div>
              <div className='space-y-3'>
                {[
                  ['User ID',  `#${selected.id}`],
                  ['Email',    selected.email],
                  ['Joined',   new Date(selected.created_at).toLocaleString('en-IN')],
                  ['Records',  `${selected.records_count ?? '—'} thyroid tests`],
                ].map(([label, value]) => (
                  <div key={label} className='flex justify-between items-center py-2 border-b border-gray-50'>
                    <span className='text-sm text-gray-500'>{label}</span>
                    <span className='text-sm font-medium text-gray-800'>{value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleDelete(selected.id)}
                className='w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5
                           rounded-xl text-sm font-medium transition-colors'
              >
                🗑️ Delete This User
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}