import { Link, useLocation, useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard'    },
  { path: '/analyze', label: 'Analyze'      },
  { path: '/history', label: 'History'      },
  { path: '/doctors', label: 'Doctors'      },
  { path: '/settings', label: 'Settings'     },
]

export default function Sidebar({ onAuthChange }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

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
        <Link to='/dashboard' className='flex items-center gap-2'>
          <span className='text-2xl'>🫂</span>
          <span className='text-white font-bold text-lg tracking-wide'>ThyroidCare</span>
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

      {/* Logout at bottom */}
      <div className='px-3 py-4 border-t border-violet-600'>
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