// Topbar.jsx
import NotificationBell from './NotificationBell'

export default function Topbar({ title }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <header className='h-16 bg-white border-b border-gray-100 flex items-center
                       justify-between px-8 fixed top-0 right-0 left-56 z-30'>
      <h1 className='text-lg font-semibold text-gray-800'>{title}</h1>
      <div className='flex items-center gap-4'>
        <NotificationBell />
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full bg-violet-100 flex items-center
                          justify-center text-violet-700 font-bold text-sm'>
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className='text-sm font-medium text-gray-700'>
            {user.name?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  )
}