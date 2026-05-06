// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Analyze from './pages/Analyze'
import VerifyEmail from './pages/VerifyEmail'
import Doctors from './pages/Doctors'
import BookAppointment from './pages/BookAppointment'
import Settings from './pages/Settings'
import Navbar from './components/Navbar'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to='/login' />
}

function App() {
  // useState so token re-evaluates on login/logout instead of being frozen at first render
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  return (
    <BrowserRouter>
      <Navbar onAuthChange={setToken} />
      <Routes>
        <Route path='/' element={<Navigate to={token ? '/dashboard' : '/login'} />} />
        <Route path='/login' element={token ? <Navigate to='/dashboard' /> : <Login onLogin={setToken} />} />
        <Route path='/register' element={token ? <Navigate to='/dashboard' /> : <Register />} />
        <Route path='/verify-email' element={<VerifyEmail onLogin={setToken} />} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path='/analyze' element={<PrivateRoute><Analyze /></PrivateRoute>} />
        <Route path='/history' element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path='/doctors' element={<PrivateRoute><Doctors /></PrivateRoute>} />
        <Route path='/book-appointment' element={<PrivateRoute><BookAppointment /></PrivateRoute>} />
        <Route path='/settings' element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App