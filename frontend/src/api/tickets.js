const API_URL = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function loginAdmin(password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  const data = await res.json()
  if (!res.ok || !data.token) {
    throw new Error(data.message || 'Invalid password')
  }
  setToken(data.token)
  return data.token
}

export async function getTickets() {
  const res = await fetch(`${API_URL}/tickets`, {
    headers: { ...authHeaders() },
  })
  const result = await res.json()
  if (res.status === 401) {
    clearToken()
    throw new Error('UNAUTHORIZED')
  }
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch tickets')
  }
  return result.data
}

export async function createTicket(ticketData) {
  const res = await fetch(`${API_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData),
  })
  const result = await res.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to create ticket')
  }
  return result.id
}

export async function updateTicket(id, ticketData) {
  const res = await fetch(`${API_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(ticketData),
  })
  const result = await res.json()
  if (res.status === 401) {
    clearToken()
    throw new Error('UNAUTHORIZED')
  }
  if (!result.success) {
    throw new Error(result.message || 'Failed to update ticket')
  }
  return result.data
}

export async function deleteTicket(id) {
  const res = await fetch(`${API_URL}/tickets/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  const result = await res.json()
  if (res.status === 401) {
    clearToken()
    throw new Error('UNAUTHORIZED')
  }
  if (!result.success) {
    throw new Error(result.message || 'Failed to delete ticket')
  }
}