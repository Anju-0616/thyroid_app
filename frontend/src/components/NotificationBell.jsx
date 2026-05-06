// src/components/NotificationBell.jsx
import { useState, useEffect, useRef } from 'react'
import { getNotifications, markAsRead, markAllRead, clearAllNotifications } from '../services/api'

const TYPE_STYLES = {
  analysis:    { bg: 'bg-blue-50',   dot: 'bg-blue-500',   icon: '🔬' },
  appointment: { bg: 'bg-green-50',  dot: 'bg-green-500',  icon: '📅' },
  reminder:    { bg: 'bg-yellow-50', dot: 'bg-yellow-500', icon: '🔔' },
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const [open, setOpen]                   = useState(false)
  const ref = useRef(null)

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications()
      setNotifications(data.notifications)
      setUnreadCount(data.unread_count)
    } catch (_) {}
  }

  // Poll every 30 seconds for new notifications
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Request browser push permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Show browser push notification for new unread ones
  useEffect(() => {
    if (unreadCount === 0) return
    const latest = notifications.find(n => !n.is_read)
    if (!latest) return
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(latest.title, {
        body: latest.message,
        icon: '/favicon.ico',
      })
    }
  }, [unreadCount])

  const handleMarkRead = async (id) => {
    await markAsRead(id)
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllRead = async () => {
    await markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  const handleClearAll = async () => {
    await clearAllNotifications()
    setNotifications([])
    setUnreadCount(0)
  }

  return (
    <div className='relative' ref={ref}>

      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        className='relative p-2 rounded-full hover:bg-blue-700 transition-colors'
      >
        <span className='text-xl'>🔔</span>
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white
                           text-xs font-bold rounded-full flex items-center justify-center'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className='absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl
                        border border-blue-100 z-50 overflow-hidden'>

          {/* Header */}
          <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
            <h3 className='font-semibold text-gray-800'>
              Notifications
              {unreadCount > 0 && (
                <span className='ml-2 bg-red-100 text-red-600 text-xs font-bold
                                 px-2 py-0.5 rounded-full'>
                  {unreadCount} new
                </span>
              )}
            </h3>
            <div className='flex gap-2'>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className='text-xs text-blue-600 hover:underline'
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className='text-xs text-red-400 hover:underline'
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className='max-h-96 overflow-y-auto'>
            {notifications.length === 0 ? (
              <div className='px-4 py-10 text-center'>
                <p className='text-3xl mb-2'>🔔</p>
                <p className='text-gray-400 text-sm'>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => {
                const style = TYPE_STYLES[n.type] || TYPE_STYLES.analysis
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.is_read && handleMarkRead(n.id)}
                    className={`px-4 py-3 border-b border-gray-50 cursor-pointer
                                hover:bg-gray-50 transition-colors
                                ${!n.is_read ? style.bg : 'bg-white'}`}
                  >
                    <div className='flex items-start gap-3'>
                      <span className='text-lg mt-0.5'>{style.icon}</span>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between gap-2'>
                          <p className={`text-sm font-semibold text-gray-800 truncate
                                        ${!n.is_read ? 'text-gray-900' : 'text-gray-500'}`}>
                            {n.title}
                          </p>
                          {!n.is_read && (
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                          )}
                        </div>
                        <p className='text-xs text-gray-500 mt-0.5 leading-relaxed'>
                          {n.message}
                        </p>
                        <p className='text-xs text-gray-400 mt-1'>{n.created_at}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

        </div>
      )}
    </div>
  )
}