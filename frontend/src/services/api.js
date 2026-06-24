// api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

const getToken = () => localStorage.getItem('token')

// ── Prediction ─────────────────────────────────────────────

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
  if (!response.ok) throw new Error(data.message || 'Prediction failed')
  return data
}

// ── Records ────────────────────────────────────────────────

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
  if (!response.ok) throw new Error(data.message || 'Failed to save record')
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
  if (!response.ok) throw new Error(data.message || 'Failed to fetch records')
  return data
}

// ── Doctors ────────────────────────────────────────────────

export const getDoctors = async () => {
  const response = await fetch(`${BASE_URL}/doctors`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch doctors')
  return data
}

// ── Appointments ───────────────────────────────────────────

export const bookAppointment = async (doctor_id, date, time, reason) => {
  const response = await fetch(`${BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ doctor_id, date, time, reason })
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to book appointment')
  return data
}

export const getAppointments = async () => {
  const response = await fetch(`${BASE_URL}/appointments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch appointments')
  return data
}

// ── Reminders ──────────────────────────────────────────────

export const getReminderPreference = async () => {
  const response = await fetch(`${BASE_URL}/reminders/preference`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch preference')
  return data
}

export const saveReminderPreference = async (frequency, is_active) => {
  const response = await fetch(`${BASE_URL}/reminders/preference`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ frequency, is_active })
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to save preference')
  return data
}

// ── Report ─────────────────────────────────────────────────

export const downloadReport = async () => {
  const response = await fetch(`${BASE_URL}/report/download`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || 'Failed to generate report')
  }
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'thyroidcare_report.pdf'
  a.click()
  window.URL.revokeObjectURL(url)
}

// ── Notifications ──────────────────────────────────────────

export const getNotifications = async () => {
  const response = await fetch(`${BASE_URL}/notifications`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch notifications')
  return data
}

export const markAsRead = async (id) => {
  const response = await fetch(`${BASE_URL}/notifications/${id}/read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to mark as read')
  return data
}

export const markAllRead = async () => {
  const response = await fetch(`${BASE_URL}/notifications/read-all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to mark all read')
  return data
}

export const clearAllNotifications = async () => {
  const response = await fetch(`${BASE_URL}/notifications/clear`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to clear notifications')
  return data
}