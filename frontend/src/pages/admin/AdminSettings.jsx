// src/pages/admin/AdminSettings.jsx
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminSettings({ onAuthChange }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <AdminLayout title='Settings' onAuthChange={onAuthChange}>
      <div className='max-w-2xl space-y-6'>

        <div className='mb-2'>
          <h2 className='text-2xl font-bold text-gray-800'>Admin Settings ⚙️</h2>
          <p className='text-gray-400 text-sm mt-1'>Manage admin account and platform preferences.</p>
        </div>

        <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
          <h3 className='font-semibold text-gray-700 mb-4'>Admin Profile</h3>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-full bg-violet-100 flex items-center
                            justify-center text-2xl font-bold text-violet-600'>
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className='font-bold text-gray-800 text-lg'>{user.name || 'Admin'}</p>
              <p className='text-gray-400 text-sm'>{user.email || '—'}</p>
              <span className='inline-block mt-1 bg-violet-100 text-violet-700 text-xs
                               font-semibold px-2.5 py-0.5 rounded-full'>
                🔐 Super Admin
              </span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
          <h3 className='font-semibold text-gray-700 mb-4'>Platform Info</h3>
          <div className='space-y-3'>
            {[
              ['App Name',  'ThyroidCare'],
              ['Version',   'v1.0.0'],
              ['Backend',   'Python + Flask'],
              ['Frontend',  'React + Vite + Tailwind CSS'],
              ['Database',  'Neon PostgreSQL'],
              ['ML Model',  'Scikit-learn (thyroid_model.pkl)'],
            ].map(([label, value]) => (
              <div key={label} className='flex justify-between items-center py-2 border-b border-gray-50'>
                <span className='text-sm text-gray-500'>{label}</span>
                <span className='text-sm font-medium text-gray-800'>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
          <h3 className='font-semibold text-gray-700 mb-4'>Quick Navigation</h3>
          <div className='grid grid-cols-3 gap-3'>
            {[
              { path: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
              { path: '/admin/users',     icon: '👥', label: 'Users'     },
              { path: '/admin/doctors',   icon: '🩺', label: 'Doctors'   },
            ].map(({ path, icon, label }) => (
              <a key={path} href={path}
                className='bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl p-4
                           text-center transition-colors'>
                <p className='text-2xl mb-1'>{icon}</p>
                <p className='text-sm font-medium'>{label}</p>
              </a>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}