// Authentication JavaScript

import { API_BASE_URL, showError, hideError } from './main.js';

// Toggle between login and register forms
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

showRegisterLink?.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

showLoginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Handle Login
const loginFormElement = document.getElementById('loginFormElement');
loginFormElement?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError('loginError');

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {  // CHANGED
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Redirect to dashboard
        window.location.href = '/index.html';
    } catch (error) {
        showError('loginError', error.message);
    }
});

// Handle Register
const registerFormElement = document.getElementById('registerFormElement');
registerFormElement?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError('registerError');

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const major = document.getElementById('registerMajor').value;
    const graduationYear = document.getElementById('registerGradYear').value;

    // Basic validation
    if (password.length < 6) {
        showError('registerError', 'Password must be at least 6 characters');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/user`, {  // CHANGED
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name,
                email,
                password,
                major,
                graduationYear
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        // Auto-login after registration
        const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {  // CHANGED
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        if (loginResponse.ok) {
            window.location.href = '/index.html';
        } else {
            // Registration success but login failed, redirect to login form
            alert('Registration successful! Please login.');
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        }
    } catch (error) {
        showError('registerError', error.message);
    }
});