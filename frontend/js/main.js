export const API_BASE_URL = ''

export async function isAuthenticated() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
      credentials: 'include',
    })
    return response.ok
  } catch {
    return false
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
      credentials: 'include',
    })
    if (!response.ok) return null
    const data = await response.json()
    return data.user || null
  } catch {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    window.location.href = '/login.html'
    return null
  }
  return user
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) {
    window.location.href = '/login.html'
    return null
  }
  if (!user.isAdmin) {
    window.location.href = '/index.html'
    return null
  }
  return user
}

export async function showAdminNavIfAdmin() {
  const user = await getCurrentUser()
  if (user?.isAdmin) {
    const adminNavItem = document.getElementById('adminNavItem')
    if (adminNavItem) adminNavItem.style.display = 'block'
  }
}

export async function apiCall(endpoint, options = {}) {
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || error.message || 'Request failed')
  }

  return response.json()
}

export async function logout() {
  try {
    await apiCall('/api/auth/logout', { method: 'POST' })
  } catch {
    // proceed to redirect regardless
  }
  window.location.href = '/login.html'
}

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn')
  logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    logout()
  })
})

export function showError(elementId, message) {
  const element = document.getElementById(elementId)
  if (element) {
    element.textContent = message
    element.style.display = 'block'
  }
}

export function hideError(elementId) {
  const element = document.getElementById(elementId)
  if (element) element.style.display = 'none'
}

export function getOccupancyLevel(current, capacity) {
  const percentage = (current / capacity) * 100
  if (percentage < 60) return 'low'
  if (percentage < 85) return 'medium'
  return 'high'
}

export function formatOccupancy(current, capacity) {
  const percentage = Math.round((current / capacity) * 100)
  return `${current}/${capacity} (${percentage}%)`
}

export function formatAmenity(amenity) {
  return amenity
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
