// Settings.jsx
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getReminderPreference, saveReminderPreference, downloadReport } from '../services/api'

export default function Settings({ onAuthChange }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [frequency, setFrequency] = useState('monthly')
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getReminderPreference()
      .then(data => { setFrequency(data.frequency || 'monthly'); setIsActive(data.is_active ?? false) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true); setSuccess(''); setError('')
    try { await saveReminderPreference(frequency, isActive); setSuccess('Preferences saved!') }
    catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDownload = async () => {
    setDownloading(true); setError('')
    try { await downloadReport() }
    catch (err) { setError(err.message) }
    finally { setDownloading(false) }
  }

  return (
    <Layout title='Settings' onAuthChange={onAuthChange}>
      <div className='max-w-2xl space-y-6'>

        <div className='mb-2'>
          <h2 className='text-2xl font-bold text-gray-800'>Settings ⚙️</h2>
          <p className='text-gray-400 text-sm mt-1'>Manage your profile and preferences.</p>
        </div>

        {/* Profile */}
        <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
          <h3 className='font-semibold text-gray-700 mb-4'>Profile</h3>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-full bg-violet-100 flex items-center
                            justify-center text-2xl font-bold text-violet-600'>
              {user.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className='font-bold text-gray-800 text-lg'>{user.name}</p>
              <p className='text-gray-400 text-sm'>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
          <h3 className='font-semibold text-gray-700 mb-1'>Test Reminders 🔔</h3>
          <p className='text-gray-400 text-sm mb-5'>
            Get email reminders to retest your thyroid at your chosen frequency.
          </p>

          {loading ? <p className='text-gray-400 text-sm'>Loading...</p> : (
            <div className='space-y-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-gray-700'>Enable reminders</p>
                  <p className='text-xs text-gray-400 mt-0.5'>Periodic email reminders to test</p>
                </div>
                <button
                  onClick={() => setIsActive(v => !v)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${isActive ? 'bg-violet-600' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isActive ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                {['monthly', 'quarterly'].map(opt => (
                  <button key={opt} onClick={() => setFrequency(opt)}
                    className={`py-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                      frequency === opt
                        ? 'border-violet-600 bg-violet-50 text-violet-700'
                        : 'border-gray-200 text-gray-500 hover:border-violet-300'
                    }`}>
                    {opt === 'monthly' ? '📅 Monthly' : '📆 Quarterly'}
                    <p className='text-xs font-normal mt-0.5 opacity-70'>
                      {opt === 'monthly' ? 'Every 30 days' : 'Every 90 days'}
                    </p>
                  </button>
                ))}
              </div>

              {success && <div className='bg-green-50 text-green-600 text-sm rounded-xl px-4 py-3'>{success}</div>}
              {error   && <div className='bg-red-50 text-red-500 text-sm rounded-xl px-4 py-3'>{error}</div>}

              <button onClick={handleSave} disabled={saving}
                className='w-full bg-violet-600 hover:bg-violet-700 text-white py-3
                           rounded-xl font-medium transition-colors disabled:opacity-50'>
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}
        </div>

        {/* PDF Report */}
        <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
          <h3 className='font-semibold text-gray-700 mb-1'>Health Report 📄</h3>
          <p className='text-gray-400 text-sm mb-5'>
            Download a PDF summary of all your thyroid test results.
          </p>
          <div className='bg-violet-50 rounded-xl p-4 mb-5 text-sm text-violet-700 space-y-1'>
            <p>📊 Summary statistics (avg TSH, T3, TT4)</p>
            <p>📋 Full test history table</p>
            <p>💡 Personalised recommendations</p>
          </div>
          {error && <div className='bg-red-50 text-red-500 text-sm rounded-xl px-4 py-3 mb-4'>{error}</div>}
          <button onClick={handleDownload} disabled={downloading}
            className='w-full bg-violet-600 hover:bg-violet-700 text-white py-3
                       rounded-xl font-medium transition-colors disabled:opacity-50 flex
                       items-center justify-center gap-2'>
            {downloading ? 'Generating PDF...' : <><span>⬇️</span> Download My Report</>}
          </button>
        </div>

      </div>
    </Layout>
  )
}