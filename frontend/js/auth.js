import { API_BASE_URL, showError, hideError } from './main.js'

const ERROR_MESSAGES = {
  WRONG_PASSWORD: 'Incorrect password. Please try again.',
  NOT_FOUND: 'No account found with that email address.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  EMAIL_IS_NOT_VALID: 'Please enter a valid email address.',
  INVALID_PASSWORD_FORMAT: 'Password format is invalid.',
  PASSWORD_TOO_SHORT_MIN_5: 'Password must be at least 5 characters.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  MISSING: 'Please fill in all required fields.',
  GRADUATION_YEAR_MUST_BE_NUMERIC: 'Graduation year must be a number.',
}

function formatFieldName(path) {
  if (!path) return 'Field'
  return path.charAt(0).toUpperCase() + path.slice(1).replace(/([A-Z])/g, ' $1')
}

function getFriendlyError(data) {
  const errors = data?.errors?.msg

  if (Array.isArray(errors) && errors.length > 0) {
    const err = errors[0]
    if (ERROR_MESSAGES[err.msg]) return ERROR_MESSAGES[err.msg]
    return `${formatFieldName(err.path)}: ${err.msg}`
  }

  if (typeof errors === 'string') {
    return ERROR_MESSAGES[errors] || errors
  }

  const code = data?.errors?.msg || data?.message || ''
  return (
    ERROR_MESSAGES[code] || code || 'Something went wrong. Please try again.'
  )
}

const showRegisterLink = document.getElementById('showRegister')
const showLoginLink = document.getElementById('showLogin')
const loginForm = document.getElementById('loginForm')
const registerForm = document.getElementById('registerForm')

showRegisterLink?.addEventListener('click', (e) => {
  e.preventDefault()
  loginForm.style.display = 'none'
  registerForm.style.display = 'block'
})

showLoginLink?.addEventListener('click', (e) => {
  e.preventDefault()
  registerForm.style.display = 'none'
  loginForm.style.display = 'block'
})

// Login
const loginFormElement = document.getElementById('loginFormElement')
loginFormElement?.addEventListener('submit', async (e) => {
  e.preventDefault()
  hideError('loginError')

  const email = document.getElementById('loginEmail').value
  const password = document.getElementById('loginPassword').value

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(getFriendlyError(data))

    window.location.href = '/index.html'
  } catch (error) {
    showError('loginError', error.message)
  }
})

// Register
const registerFormElement = document.getElementById('registerFormElement')
registerFormElement?.addEventListener('submit', async (e) => {
  e.preventDefault()
  hideError('registerError')

  const name = document.getElementById('registerName').value
  const email = document.getElementById('registerEmail').value
  const password = document.getElementById('registerPassword').value
  const major = document.getElementById('registerMajor').value
  const graduationYear = document.getElementById('registerGradYear').value

  if (password.length < 6) {
    showError('registerError', 'Password must be at least 6 characters')
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, major, graduationYear }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(getFriendlyError(data))

    // Auto-login after registration
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    if (loginResponse.ok) {
      window.location.href = '/index.html'
    } else {
      alert('Registration successful! Please login.')
      registerForm.style.display = 'none'
      loginForm.style.display = 'block'
    }
  } catch (error) {
    showError('registerError', error.message)
  }
})
