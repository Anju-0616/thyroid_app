//Dashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRecords } from '../services/api'
import TrendChart from '../components/TrendChart'
import ResultPieChart from '../components/ResultPieChart'
import SummaryCards from '../components/SummaryCards'

const STATUS_STYLES = {
  normal:      { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  hypothyroid: { bg: 'bg-blue-50',  text: 'text-blue-700',  border: 'border-blue-200',  dot: 'bg-blue-500'  },
  hyperthyroid:{ bg: 'bg-red-50',   text: 'text-red-700',   border: 'border-red-200',   dot: 'bg-red-500'   },
}

function Dashboard() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getRecords()
      .then(data => setRecords(data))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }, [])

  const latest = records[0] || null
  const latestStyle = latest ? STATUS_STYLES[latest.result] || STATUS_STYLES.normal : null

  return (
    <div className='min-h-screen bg-blue-50 py-10 px-4'>
      <div className='max-w-4xl mx-auto'>

        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-blue-700'>
            Welcome back, {user.name?.split(' ')[0] || 'User'} 🦋
          </h1>
          <p className='text-gray-500 text-sm mt-1'>Here's an overview of your thyroid health.</p>
        </div>

        {/* Summary Stat Cards */}
        <SummaryCards records={records} />

        {/* Latest Result */}
        {loading ? (
          <div className='text-center text-gray-400 py-12'>Loading your records...</div>
        ) : latest ? (
          <div className={`rounded-xl border p-6 mb-8 ${latestStyle.bg} ${latestStyle.border}`}>
            <div className='flex items-center justify-between mb-4'>
              <h2 className={`text-lg font-semibold ${latestStyle.text}`}>Latest Result</h2>
              <div className='flex items-center gap-2'>
                <span className={`w-2 h-2 rounded-full ${latestStyle.dot}`}></span>
                <span className={`text-sm font-medium capitalize ${latestStyle.text}`}>{latest.result}</span>
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4'>
              {[
                { label: 'TSH', value: latest.tsh },
                { label: 'T3',  value: latest.t3  },
                { label: 'TT4', value: latest.tt4 },
              ].map(({ label, value }) => (
                <div key={label} className='bg-white bg-opacity-60 rounded-lg p-3 text-center'>
                  <p className={`text-xs font-medium ${latestStyle.text} opacity-70`}>{label}</p>
                  <p className={`text-xl font-bold ${latestStyle.text}`}>{value}</p>
                </div>
              ))}
            </div>
            <p className={`text-xs mt-4 ${latestStyle.text} opacity-60`}>
              Tested on {new Date(latest.created_at).toLocaleString('en-IN')}
            </p>
          </div>
        ) : (
          <div className='bg-white rounded-xl border border-blue-100 p-10 text-center mb-8'>
            <p className='text-4xl mb-3'>🦋</p>
            <p className='text-gray-600 font-medium'>No tests yet</p>
            <p className='text-gray-400 text-sm mt-1'>Run your first analysis to see results here.</p>
          </div>
        )}

        {/* Charts */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <TrendChart records={records} />
          <ResultPieChart records={records} />
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Link to='/analyze'
            className='bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 text-center transition-colors'>
            <p className='text-2xl mb-1'>🔬</p>
            <p className='font-semibold'>New Analysis</p>
            <p className='text-xs opacity-75 mt-1'>Enter TSH, T3, TT4 values</p>
          </Link>
          <Link to='/history'
            className='bg-white hover:bg-blue-50 border border-blue-100 text-blue-700 rounded-xl p-5 text-center transition-colors'>
            <p className='text-2xl mb-1'>📋</p>
            <p className='font-semibold'>View History</p>
            <p className='text-xs opacity-75 mt-1'>All past test records</p>
          </Link>
          <Link to='/analyze'
            className='bg-white hover:bg-blue-50 border border-blue-100 text-blue-700 rounded-xl p-5 text-center transition-colors'>
            <p className='text-2xl mb-1'>📈</p>
            <p className='font-semibold'>New Test</p>
            <p className='text-xs opacity-75 mt-1'>Track your progress</p>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Dashboard