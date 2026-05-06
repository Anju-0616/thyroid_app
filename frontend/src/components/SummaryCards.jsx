// src/components/SummaryCards.jsx
function SummaryCards({ records }) {
  const total = records.length
  const normalCount = records.filter(r => r.result === 'normal').length
  const abnormalCount = total - normalCount

  const lastTested = records[0]
    ? new Date(records[0].created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  const avgTSH = total > 0
    ? (records.reduce((sum, r) => sum + parseFloat(r.tsh), 0) / total).toFixed(2)
    : '—'

  // Streak = how many consecutive most-recent results are 'normal'
  let streak = 0
  for (const r of records) {
    if (r.result === 'normal') streak++
    else break
  }

  const cards = [
    { label: 'Total Tests',         value: total,        sub: 'all time',       color: 'blue'   },
    { label: 'Normal Results',      value: normalCount,  sub: 'tests',          color: 'green'  },
    { label: 'Abnormal Results',    value: abnormalCount,sub: 'tests',          color: 'red'    },
    { label: 'Last Tested',         value: lastTested,   sub: '',               color: 'purple' },
    { label: 'Avg TSH',             value: avgTSH,       sub: 'mIU/L',          color: 'teal'   },
    { label: 'Normal Streak',       value: streak,       sub: streak === 1 ? 'test in a row' : 'tests in a row', color: 'orange' },
  ]

  const colors = {
    blue:   'bg-blue-50 text-blue-600 border-blue-100',
    green:  'bg-green-50 text-green-600 border-green-100',
    red:    'bg-red-50 text-red-600 border-red-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    teal:   'bg-teal-50 text-teal-600 border-teal-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
      {cards.map(({ label, value, sub, color }) => (
        <div key={label} className={`rounded-xl border p-5 ${colors[color]}`}>
          <p className='text-sm font-medium opacity-70'>{label}</p>
          <p className='text-3xl font-bold mt-1'>{value}</p>
          {sub && <p className='text-xs mt-1 opacity-60'>{sub}</p>}
        </div>
      ))}
    </div>
  )
}

export default SummaryCards