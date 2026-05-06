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

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to='/login' />
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'        element={<Navigate to={token ? '/dashboard' : '/login'} />} />
        <Route path='/login'   element={token ? <Navigate to='/dashboard' /> : <Login onLogin={setToken} />} />
        <Route path='/register' element={token ? <Navigate to='/dashboard' /> : <Register />} />
        <Route path='/verify-email' element={<VerifyEmail />} />

        <Route path='/dashboard'       element={<PrivateRoute><Dashboard       onAuthChange={setToken} /></PrivateRoute>} />
        <Route path='/analyze'         element={<PrivateRoute><Analyze         onAuthChange={setToken} /></PrivateRoute>} />
        <Route path='/history'         element={<PrivateRoute><History         onAuthChange={setToken} /></PrivateRoute>} />
        <Route path='/doctors'         element={<PrivateRoute><Doctors         onAuthChange={setToken} /></PrivateRoute>} />
        <Route path='/settings'        element={<PrivateRoute><Settings        onAuthChange={setToken} /></PrivateRoute>} />
        <Route path='/book-appointment' element={<PrivateRoute><BookAppointment onAuthChange={setToken} /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}