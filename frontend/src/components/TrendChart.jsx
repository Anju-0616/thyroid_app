// TrendChart.jsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

function TrendChart({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className='bg-white rounded-xl border border-blue-100 p-6 text-center text-gray-400'>
        No data yet to show trends.
      </div>
    )
  }

  const data = [...records]
    .reverse()
    .map(r => ({
      date: new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      TSH: parseFloat(r.tsh),
      T3: parseFloat(r.t3),
      TT4: parseFloat(r.tt4),
    }))

  return (
    <div className='bg-white rounded-xl border border-blue-100 p-6'>
      <h2 className='text-lg font-semibold text-blue-700 mb-4'>Hormone Trends Over Time</h2>
      <ResponsiveContainer width='100%' height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
          <XAxis dataKey='date' tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type='monotone' dataKey='TSH' stroke='#2563eb' strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type='monotone' dataKey='T3' stroke='#16a34a' strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type='monotone' dataKey='TT4' stroke='#dc2626' strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendChart