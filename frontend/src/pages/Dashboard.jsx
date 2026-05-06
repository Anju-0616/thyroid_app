// Dashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRecords } from '../services/api'
import Layout from '../components/Layout'
import SummaryCards from '../components/SummaryCards'
import TrendChart from '../components/TrendChart'
import ResultPieChart from '../components/ResultPieChart'

const STATUS = {
  normal:       { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700',  dot: 'bg-green-500'  },
  hypothyroid:  { bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-700',   dot: 'bg-blue-500'   },
  hyperthyroid: { bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',    dot: 'bg-red-500'    },
}

export default function Dashboard({ onAuthChange }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getRecords()
      .then(setRecords)
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }, [])

  const latest = records[0] || null
  const s = latest ? STATUS[latest.result] || STATUS.normal : null

  return (
    <Layout title='Dashboard' onAuthChange={onAuthChange}>

      {/* Welcome */}
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Welcome back, {user.name?.split(' ')[0] || 'User'} 👋
        </h2>
        <p className='text-gray-400 text-sm mt-1'>Here's your thyroid health overview.</p>
      </div>

      {/* Summary cards */}
      <SummaryCards records={records} />

      {/* Latest result */}
      {loading ? (
        <div className='text-center text-gray-400 py-10'>Loading...</div>
      ) : latest ? (
        <div className={`rounded-2xl border p-6 mb-6 ${s.bg} ${s.border}`}>
          <div className='flex items-center justify-between mb-4'>
            <h3 className={`font-semibold ${s.text}`}>Latest Result</h3>
            <div className='flex items-center gap-2'>
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              <span className={`text-sm font-medium capitalize ${s.text}`}>{latest.result}</span>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            {[['TSH', latest.tsh], ['T3', latest.t3], ['TT4', latest.tt4]].map(([label, val]) => (
              <div key={label} className='bg-white bg-opacity-70 rounded-xl p-3 text-center'>
                <p className={`text-xs font-medium ${s.text} opacity-70`}>{label}</p>
                <p className={`text-2xl font-bold ${s.text}`}>{val}</p>
              </div>
            ))}
          </div>
          <p className={`text-xs mt-4 ${s.text} opacity-60`}>
            Tested on {new Date(latest.created_at).toLocaleString('en-IN')}
          </p>
        </div>
      ) : (
        <div className='bg-white rounded-2xl border border-gray-100 p-10 text-center mb-6'>
          <p className='text-4xl mb-3'>🦋</p>
          <p className='text-gray-600 font-medium'>No tests yet</p>
          <p className='text-gray-400 text-sm mt-1'>Run your first analysis to see results here.</p>
          <Link to='/analyze'
            className='inline-block mt-4 bg-violet-600 hover:bg-violet-700 text-white
                       px-6 py-2 rounded-xl text-sm font-medium transition-colors'>
            Start Analysis
          </Link>
        </div>
      )}

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <TrendChart records={records} />
        <ResultPieChart records={records} />
      </div>

      {/* Quick actions */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Link to='/analyze'
          className='bg-violet-600 hover:bg-violet-700 text-white rounded-2xl p-5
                     text-center transition-colors shadow-sm'>
          <p className='text-2xl mb-2'>🔬</p>
          <p className='font-semibold'>New Analysis</p>
          <p className='text-xs opacity-75 mt-1'>Enter TSH, T3, TT4 values</p>
        </Link>
        <Link to='/history'
          className='bg-white hover:bg-gray-50 border border-gray-100 text-gray-700
                     rounded-2xl p-5 text-center transition-colors shadow-sm'>
          <p className='text-2xl mb-2'>📋</p>
          <p className='font-semibold'>View History</p>
          <p className='text-xs text-gray-400 mt-1'>All past test records</p>
        </Link>
        <Link to='/doctors'
          className='bg-white hover:bg-gray-50 border border-gray-100 text-gray-700
                     rounded-2xl p-5 text-center transition-colors shadow-sm'>
          <p className='text-2xl mb-2'>🩺</p>
          <p className='font-semibold'>Find a Doctor</p>
          <p className='text-xs text-gray-400 mt-1'>Book an appointment</p>
        </Link>
      </div>

    </Layout>
  )
}