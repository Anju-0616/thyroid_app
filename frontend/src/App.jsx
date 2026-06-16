// App.jsx
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Analyze from './pages/Analyze'
import Doctors from './pages/Doctors'
import Settings from './pages/Settings'
import BookAppointment from './pages/BookAppointment'
import VerifyEmail from './pages/VerifyEmail'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminDoctors from './pages/admin/AdminDoctors'
import AdminSettings from './pages/admin/AdminSettings'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to='/login' />
}

function AdminRoute({ children }) {
  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user') || '{}')
  if (!token) return <Navigate to='/login' />
  if (!user.is_admin) return <Navigate to='/dashboard' />
  return children
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const defaultRoute = token
    ? (user.is_admin ? '/admin/dashboard' : '/dashboard')
    : '/login'

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={defaultRoute} />} />
        <Route path='/login'        element={token ? <Navigate to={defaultRoute} /> : <Login onLogin={setToken} />} />
        <Route path='/register'     element={token ? <Navigate to={defaultRoute} /> : <Register />} />
        <Route path='/verify-email' element={<VerifyEmail />} />

        {/* User routes */}
        <Route path='/dashboard'        element={<PrivateRoute><Dashboard       onAuthChange={setToken} /></PrivateRoute>} />
        <Route path='/analyze'          element={<PrivateRoute><Analyze         onAuthChange={setToken} /></PrivateRoute>} />
        <Route path='/history'          element={<PrivateRoute><History         onAuthChange={setToken} /></PrivateRoute>} />
        <Route path='/doctors'          element={<PrivateRoute><Doctors         onAuthChange={setToken} /></PrivateRoute>} />
        <Route path='/settings'         element={<PrivateRoute><Settings        onAuthChange={setToken} /></PrivateRoute>} />
        <Route path='/book-appointment' element={<PrivateRoute><BookAppointment onAuthChange={setToken} /></PrivateRoute>} />

        {/* Admin routes */}
        <Route path='/admin/dashboard' element={<AdminRoute><AdminDashboard onAuthChange={setToken} /></AdminRoute>} />
        <Route path='/admin/users'     element={<AdminRoute><AdminUsers     onAuthChange={setToken} /></AdminRoute>} />
        <Route path='/admin/doctors'   element={<AdminRoute><AdminDoctors   onAuthChange={setToken} /></AdminRoute>} />
        <Route path='/admin/settings'  element={<AdminRoute><AdminSettings  onAuthChange={setToken} /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}