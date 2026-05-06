// History.jsx
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import RecordTable from '../components/RecordTable'
import { getRecords } from '../services/api'

export default function History({ onAuthChange }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getRecords()
      .then(setRecords)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title='History' onAuthChange={onAuthChange}>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>Test History 📋</h2>
        <p className='text-gray-400 text-sm mt-1'>All your past thyroid test results.</p>
      </div>

      {loading && <div className='text-center text-gray-400 py-16'>Loading records...</div>}

      {error && (
        <div className='bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm'>{error}</div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className='bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm'>
          <p className='text-5xl mb-4'>🦋</p>
          <p className='text-gray-600 font-medium text-lg'>No records yet</p>
          <p className='text-gray-400 text-sm mt-2'>
            Go to Analyze to run your first thyroid test.
          </p>
        </div>
      )}

      {!loading && records.length > 0 && <RecordTable records={records} />}
    </Layout>
  )
}