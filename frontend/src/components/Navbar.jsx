// Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell'

function Navbar({ onAuthChange }) {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    onAuthChange?.(null)
    navigate('/login')
  }

  return (
    <nav className='bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md'>
      <Link to='/' className='text-xl font-bold tracking-wide'>
        🦋 ThyroidCare
      </Link>
      <div className='flex items-center gap-6'>
        {token ? (
          <>
            <span className='text-sm'>Hello, {user.name} 👋</span>
            <Link to='/dashboard' className='hover:underline text-sm'>Dashboard</Link>
            <Link to='/history' className='hover:underline text-sm'>History</Link>
            <Link to='/analyze' className='hover:underline text-sm'>Analyze</Link>
            <Link to='/doctors' className='hover:underline text-sm'>Doctors</Link>
            <Link to='/settings' className='hover:underline text-sm'>Settings</Link>
            <NotificationBell />
            <button
              onClick={handleLogout}
              className='bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-50'
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login' className='hover:underline text-sm'>Login</Link>
            <Link to='/register'
              className='bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-50'>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar