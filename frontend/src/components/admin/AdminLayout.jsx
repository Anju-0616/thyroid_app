// src/components/admin/AdminLayout.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/admin/users',     icon: '👥', label: 'Users'     },
  { path: '/admin/doctors',   icon: '🩺', label: 'Doctors'   },
  { path: '/admin/settings',  icon: '⚙️',  label: 'Settings'  },
]

function AdminSidebar({ onAuthChange }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    onAuthChange?.(null)
    navigate('/login')
  }

  return (
    <aside className='fixed top-0 left-0 h-screen w-56 bg-violet-700 flex flex-col z-40'>

      {/* Logo */}
      <div className='px-6 py-6 border-b border-violet-600'>
        <Link to='/admin/dashboard' className='flex items-center gap-2'>
          <span className='text-2xl'>🫂</span>
          <div>
            <span className='text-white font-bold text-lg tracking-wide block leading-tight'>ThyroidCare</span>
            <span className='text-violet-300 text-xs font-medium'>Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className='flex-1 px-3 py-6 space-y-1 overflow-y-auto'>
        {NAV_ITEMS.map(({ path, icon, label }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${active
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-violet-100 hover:bg-violet-600'
                }`}
            >
              <span className='text-base'>{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Admin badge + logout */}
      <div className='px-3 py-4 border-t border-violet-600 space-y-2'>
        <div className='flex items-center gap-3 px-4 py-2'>
          <div className='w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold'>A</div>
          <div>
            <p className='text-white text-xs font-semibold'>Admin</p>
            <p className='text-violet-300 text-xs'>Super User</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className='flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm
                     font-medium text-violet-200 hover:bg-violet-600 transition-all'
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}

function AdminTopbar({ title }) {
  return (
    <header className='h-16 bg-white border-b border-gray-100 flex items-center
                       justify-between px-8 fixed top-0 right-0 left-56 z-30'>
      <h1 className='text-lg font-semibold text-gray-800'>{title}</h1>
      <div className='flex items-center gap-2'>
        <span className='bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full'>
          🔐 Admin
        </span>
      </div>
    </header>
  )
}

export default function AdminLayout({ children, title, onAuthChange }) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <AdminSidebar onAuthChange={onAuthChange} />
      <AdminTopbar title={title} />
      <main className='ml-56 pt-16 min-h-screen'>
        <div className='p-8'>
          {children}
        </div>
      </main>
    </div>
  )
}