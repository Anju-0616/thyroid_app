// src/components/InputForm.jsx
import { useState } from 'react'

function InputForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({ tsh: '', t3: '', tt4: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData.tsh, formData.t3, formData.tt4)
  }

  return (
    <div className='bg-white p-6 rounded-2xl shadow-md'>
      <h2 className='text-lg font-semibold text-gray-700 mb-4'>
        Enter Hormone Levels
      </h2>

      <form onSubmit={handleSubmit} className='space-y-4'>

        {/* TSH */}
        <div>
          <label className='text-sm font-medium text-gray-700'>
            TSH — Thyroid Stimulating Hormone
            <span className='text-gray-400 font-normal ml-1'>
              (Normal: 0.4 – 4.5 mIU/L)
            </span>
          </label>
          <input
            type='number'
            name='tsh'
            value={formData.tsh}
            onChange={handleChange}
            placeholder='e.g. 2.5'
            step='any'
            required
            className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm'
          />
        </div>

        {/* T3 */}
        <div>
          <label className='text-sm font-medium text-gray-700'>
            T3 — Triiodothyronine
            <span className='text-gray-400 font-normal ml-1'>
              (Normal: 80 – 200 ng/dL)
            </span>
          </label>
          <input
            type='number'
            name='t3'
            value={formData.t3}
            onChange={handleChange}
            placeholder='e.g. 120'
            step='any'
            required
            className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm'
          />
        </div>

        {/* TT4 */}
        <div>
          <label className='text-sm font-medium text-gray-700'>
            TT4 — Total Thyroxine
            <span className='text-gray-400 font-normal ml-1'>
              (Normal: 5.0 – 12.0 µg/dL)
            </span>
          </label>
          <input
            type='number'
            name='tt4'
            value={formData.tt4}
            onChange={handleChange}
            placeholder='e.g. 8.5'
            step='any'
            required
            className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50'
        >
          {loading ? 'Analyzing...' : 'Analyze My Thyroid'}
        </button>
      </form>
    </div>
  )
}

export default InputForm