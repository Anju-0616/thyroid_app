// Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/auth'

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { ok, status, data } = await loginUser(formData.email, formData.password)
      if (!ok) {
        if (status === 403 && data.needs_verification) {
          navigate('/verify-email', { state: { email: formData.email } })
          return
        }
        throw new Error(data.message || 'Login failed. Please try again.')
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onLogin(data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-blue-50 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-2xl shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold text-blue-600 mb-2 text-center'>Welcome Back 👋</h2>
        <p className='text-gray-500 text-sm text-center mb-6'>Login to your ThyroidCare account</p>

        {error && (
          <div className='bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-4 text-sm'>{error}</div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <input type='email' name='email' value={formData.email} onChange={handleChange}
              placeholder='Enter your email' required
              className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm' />
          </div>
          <div>
            <label className='text-sm font-medium text-gray-700'>Password</label>
            <input type='password' name='password' value={formData.password} onChange={handleChange}
              placeholder='Enter your password' required
              className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm' />
          </div>
          <button type='submit' disabled={loading}
            className='w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className='text-sm text-center text-gray-500 mt-4'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-600 font-medium hover:underline'>Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login