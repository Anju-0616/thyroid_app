import { useState, useEffect } from 'react'
import RecordTable from '../components/RecordTable'
import { getRecords } from '../services/api'

function History() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getRecords()
        setRecords(data)
      } catch (err) {
        setError(err.message || 'Failed to load records')
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [])

  return (
    <div className='min-h-screen bg-blue-50 py-10 px-4'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-blue-600 mb-2'>My History 📋</h1>
        <p className='text-gray-500 mb-8 text-sm'>
          All your past thyroid test results in one place.
        </p>

        {loading && (
          <div className='text-center text-gray-400 py-10'>
            Loading your records...
          </div>
        )}

        {error && (
          <div className='bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm'>
            {error}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className='bg-white rounded-2xl shadow-md p-10 text-center'>
            <p className='text-gray-400 text-lg'>No records found 🦋</p>
            <p className='text-gray-400 text-sm mt-2'>
              Go to Dashboard and analyze your thyroid levels to see results here.
            </p>
          </div>
        )}

        {!loading && records.length > 0 && (
          <RecordTable records={records} />
        )}
      </div>
    </div>
  )
}

export default History