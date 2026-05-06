// VerifyEmail.jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''

  const [devOtp, setDevOtp] = useState(location.state?.devOtp || null)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const inputs = useRef([])

  useEffect(() => {
    if (!email) navigate('/register')
  }, [email])

  useEffect(() => {
    if (countdown === 0) return
    const timer = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      inputs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter all 6 digits.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Verification failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setSuccess('Email verified! Redirecting...')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setSuccess('New OTP sent!')
      setCountdown(60)
      // Fix: update dev OTP hint when resend returns a new one
      if (data.dev_otp) setDevOtp(data.dev_otp)
    } catch (err) {
      setError('Failed to resend. Try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-blue-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl shadow-sm border border-blue-100 p-8 w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='text-5xl mb-4'>🦋</div>
          <h1 className='text-2xl font-bold text-blue-700'>Verify your email</h1>
          <p className='text-gray-500 mt-2 text-sm'>
            We sent a 6-digit code to<br />
            <span className='font-medium text-gray-700'>{email}</span>
          </p>

          {devOtp && (
            <div className='mt-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm'>
              <span className='text-yellow-700 font-medium'>Dev OTP: </span>
              <span className='font-mono font-bold text-yellow-800 tracking-widest'>{devOtp}</span>
            </div>
          )}
        </div>

        <div className='flex gap-2 justify-center mb-6' onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className='w-12 h-14 text-center text-xl font-bold border-2 border-blue-100
                         rounded-xl focus:outline-none focus:border-blue-500 transition-all'
            />
          ))}
        </div>

        {error && (
          <div className='bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4 text-center'>{error}</div>
        )}
        {success && (
          <div className='bg-green-50 text-green-600 text-sm rounded-lg px-4 py-3 mb-4 text-center'>{success}</div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium
                     py-3 rounded-xl transition-colors disabled:opacity-60'
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <div className='text-center mt-5 text-sm text-gray-500'>
          {countdown > 0 ? (
            <span>Resend code in <span className='font-medium text-blue-600'>{countdown}s</span></span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className='text-blue-600 hover:underline font-medium disabled:opacity-50'
            >
              {resendLoading ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}