import { useState } from 'react'
import Layout from '../components/Layout'
import InputForm from '../components/InputForm'
import ResultCard from '../components/ResultCard'
import { predictThyroid, saveRecord } from '../services/api'

export default function Analyze({ onAuthChange }) {
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
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title='Analyze' onAuthChange={onAuthChange}>
      <div className='max-w-2xl'>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Thyroid Analysis 🔬</h2>
          <p className='text-gray-400 text-sm mt-1'>
            Enter your hormone levels to get an instant ML-powered prediction.
          </p>
        </div>

        <InputForm onSubmit={handlePredict} loading={loading} />

        {error && (
          <div className='bg-red-50 text-red-500 px-4 py-3 rounded-xl mt-4 text-sm'>{error}</div>
        )}

        {result && (
          <div className='mt-6'>
            <ResultCard result={result} />
            {saved && (
              <p className='text-green-500 text-sm mt-3 text-center'>
                ✅ Result saved to your history!
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}