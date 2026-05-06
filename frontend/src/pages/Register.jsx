// Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/auth'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await registerUser(formData.name, formData.email, formData.password)
      navigate('/verify-email', { state: { email: data.email, devOtp: data.dev_otp || null } })
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Left panel */}
      <div className='hidden lg:flex w-1/2 bg-violet-700 flex-col items-center justify-center p-12'>
        <span className='text-7xl mb-6'>🦋</span>
        <h1 className='text-4xl font-bold text-white mb-3'>ThyroidCare</h1>
        <p className='text-violet-200 text-center text-lg max-w-xs'>
          Join thousands monitoring their thyroid health with AI-powered insights.
        </p>
      </div>

      {/* Right panel */}
      <div className='flex-1 flex items-center justify-center px-8'>
        <div className='w-full max-w-md'>
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-gray-800'>Create account 🦋</h2>
            <p className='text-gray-400 mt-2'>Start monitoring your thyroid health today</p>
          </div>

          {error && (
            <div className='bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm'>{error}</div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            {[
              { label: 'Full Name',  name: 'name',     type: 'text',     placeholder: 'your name'           },
              { label: 'Email',      name: 'email',    type: 'email',    placeholder: 'you@example.com'    },
              { label: 'Password',   name: 'password', type: 'password', placeholder: '••••••••'           },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className='text-sm font-medium text-gray-700'>{label}</label>
                <input type={type} placeholder={placeholder} value={formData[name]} required
                  onChange={e => setFormData({ ...formData, [name]: e.target.value })}
                  className='w-full mt-1.5 px-4 py-3 border border-gray-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm bg-white' />
              </div>
            ))}
            <button type='submit' disabled={loading}
              className='w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl
                         font-medium transition-colors disabled:opacity-50 mt-2'>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className='text-sm text-center text-gray-400 mt-6'>
            Already have an account?{' '}
            <Link to='/login' className='text-violet-600 font-medium hover:underline'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}