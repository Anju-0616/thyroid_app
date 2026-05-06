// recordtable.jsx
function RecordTable({ records }) {
  const getBadgeStyle = (result) => {
    switch (result) {
      case 'hypothyroid':
        return 'bg-orange-100 text-orange-600'
      case 'hyperthyroid':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-green-100 text-green-600'
    }
  }

  return (
    <div className='bg-white rounded-2xl shadow-md overflow-hidden'>
      <table className='w-full text-sm'>
        <thead className='bg-blue-600 text-white'>
          <tr>
            <th className='px-4 py-3 text-left'>#</th>
            <th className='px-4 py-3 text-left'>Date</th>
            <th className='px-4 py-3 text-left'>TSH</th>
            <th className='px-4 py-3 text-left'>T3</th>
            <th className='px-4 py-3 text-left'>TT4</th>
            <th className='px-4 py-3 text-left'>Result</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr
              key={record.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
            >
              <td className='px-4 py-3 text-gray-500'>{index + 1}</td>
              <td className='px-4 py-3 text-gray-600'>{record.created_at}</td>
              <td className='px-4 py-3 text-gray-700 font-medium'>{record.tsh}</td>
              <td className='px-4 py-3 text-gray-700 font-medium'>{record.t3}</td>
              <td className='px-4 py-3 text-gray-700 font-medium'>{record.tt4}</td>
              <td className='px-4 py-3'>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getBadgeStyle(record.result)}`}>
                  {record.result}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecordTable