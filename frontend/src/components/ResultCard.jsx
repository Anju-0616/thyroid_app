function ResultCard({ result }) {
  const getStyle = () => {
    switch (result.result) {
      case 'hypothyroid':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-300',
          text: 'text-orange-600',
          emoji: '🔻',
          message: 'Your results suggest an underactive thyroid (low hormone production). Please consult a doctor.'
        }
      case 'hyperthyroid':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-600',
          emoji: '🔺',
          message: 'Your results suggest an overactive thyroid (excess hormone production). Please consult a doctor.'
        }
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-300',
          text: 'text-green-600',
          emoji: '✅',
          message: 'Your thyroid hormone levels appear to be within the normal range.'
        }
    }
  }

  const style = getStyle()

  return (
    <div className={`${style.bg} border ${style.border} rounded-2xl p-6`}>
      <div className='flex items-center gap-3 mb-4'>
        <span className='text-3xl'>{style.emoji}</span>
        <div>
          <h3 className='text-lg font-bold text-gray-700'>Analysis Result</h3>
          <p className={`text-xl font-bold capitalize ${style.text}`}>
            {result.result}
          </p>
        </div>
      </div>

      <p className='text-gray-600 text-sm mb-4'>{style.message}</p>

      <div className='grid grid-cols-3 gap-3'>
        <div className='bg-white rounded-xl p-3 text-center shadow-sm'>
          <p className='text-xs text-gray-400 mb-1'>TSH</p>
          <p className='text-lg font-bold text-gray-700'>{result.tsh}</p>
          <p className='text-xs text-gray-400'>mIU/L</p>
        </div>
        <div className='bg-white rounded-xl p-3 text-center shadow-sm'>
          <p className='text-xs text-gray-400 mb-1'>T3</p>
          <p className='text-lg font-bold text-gray-700'>{result.t3}</p>
          <p className='text-xs text-gray-400'>nmol/L</p>
        </div>
        <div className='bg-white rounded-xl p-3 text-center shadow-sm'>
          <p className='text-xs text-gray-400 mb-1'>TT4</p>
          <p className='text-lg font-bold text-gray-700'>{result.tt4}</p>
          <p className='text-xs text-gray-400'>nmol/L</p>
        </div>
      </div>

      <p className='text-xs text-gray-400 mt-4 text-center'>
        ⚠️ This is a preliminary analysis only. Always consult a healthcare professional.
      </p>
    </div>
  )
}

export default ResultCard