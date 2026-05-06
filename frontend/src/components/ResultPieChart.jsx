// ResultPieChart.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = {
  normal: '#16a34a',
  hypothyroid: '#2563eb',
  hyperthyroid: '#dc2626',
}

function ResultPieChart({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className='bg-white rounded-xl border border-blue-100 p-6 text-center text-gray-400'>
        No data yet to show distribution.
      </div>
    )
  }

  const counts = records.reduce((acc, r) => {
    acc[r.result] = (acc[r.result] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }))

  return (
    <div className='bg-white rounded-xl border border-blue-100 p-6'>
      <h2 className='text-lg font-semibold text-blue-700 mb-4'>Result Distribution</h2>
      <ResponsiveContainer width='100%' height={280}>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            dataKey='value'
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#888'} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} tests`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ResultPieChart