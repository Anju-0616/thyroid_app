// Analyze.jsx
import { useState } from 'react'
import InputForm from '../components/InputForm'
import ResultCard from '../components/ResultCard'
import { predictThyroid, saveRecord } from '../services/api'

function Analyze() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handlePredict = async (tsh, t3, tt4) => {
    setLoading(true)
    setError('')
    setResult(null)
    setSaved(false)

    try {
      const data = await predictThyroid(tsh, t3, tt4)
      setResult(data)
      await saveRecord(tsh, t3, tt4, data.result)
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-blue-50 py-10 px-4'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold text-blue-600 mb-2'>Analyze Thyroid 🦋</h1>
        <p className='text-gray-500 mb-8 text-sm'>
          Enter your thyroid hormone levels below to get an instant analysis.
        </p>

        <InputForm onSubmit={handlePredict} loading={loading} />

        {error && (
          <div className='bg-red-50 text-red-500 px-4 py-3 rounded-lg mt-6 text-sm'>
            {error}
          </div>
        )}

        {result && (
          <div className='mt-6'>
            <ResultCard result={result} />
            {saved && (
              <p className='text-green-500 text-sm mt-2 text-center'>
                ✅ Result saved to your history!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Analyze