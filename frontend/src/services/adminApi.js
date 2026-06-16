// src/services/adminApi.js
const BASE_URL = 'http://127.0.0.1:5000/api'

const getToken = () => localStorage.getItem('token')

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
})

// ── Users ───────────────────────────────────────────────────

export const adminGetUsers = async () => {
  const res = await fetch(`${BASE_URL}/admin/users`, { headers: authHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch users')
  return data
}

export const adminDeleteUser = async (userId) => {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to delete user')
  return data
}

// ── Doctors ─────────────────────────────────────────────────

export const adminGetDoctors = async () => {
  const res = await fetch(`${BASE_URL}/doctors`, { headers: authHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch doctors')
  return data
}

export const adminAddDoctor = async (doctorData) => {
  const res = await fetch(`${BASE_URL}/doctors`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(doctorData)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to add doctor')
  return data.doctor
}

export const adminDeleteDoctor = async (doctorId) => {
  const res = await fetch(`${BASE_URL}/doctors/${doctorId}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to delete doctor')
  return data
}

// ── Appointments ────────────────────────────────────────────

export const adminGetAllAppointments = async () => {
  const res = await fetch(`${BASE_URL}/admin/appointments`, { headers: authHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch appointments')
  return data
}

export const adminGetDoctorAppointments = async (doctorId) => {
  const res = await fetch(`${BASE_URL}/admin/doctors/${doctorId}/appointments`, {
    headers: authHeaders()
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch appointments')
  return data
}