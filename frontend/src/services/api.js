const BASE_URL = 'http://127.0.0.1:5000/api'

const getToken = () => localStorage.getItem('token')

export const predictThyroid = async (tsh, t3, tt4) => {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ tsh, t3, tt4 })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Prediction failed')
  }

  return data
}

export const saveRecord = async (tsh, t3, tt4, result) => {
  const response = await fetch(`${BASE_URL}/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ tsh, t3, tt4, result })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to save record')
  }

  return data
}

export const getRecords = async () => {
  const response = await fetch(`${BASE_URL}/records`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch records')
  }

  return data
}