// API Base URL
export const API_BASE_URL = 'http://localhost:5000';

// Check if user is authenticated by calling the token verification endpoint
export async function isAuthenticated() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
            credentials: 'include'
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Redirect to login if not authenticated
export async function requireAuth() {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// API call helper 
export async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
}

// Logout function
export async function logout() {
    try {
        await apiCall('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/login.html';
    }
}

// Logout button handler
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// Show error message
export function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

// Hide error message
export function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Get occupancy level (low, medium, high)
export function getOccupancyLevel(current, capacity) {
    const percentage = (current / capacity) * 100;
    if (percentage < 60) return 'low';
    if (percentage < 85) return 'medium';
    return 'high';
}

// Format occupancy text
export function formatOccupancy(current, capacity) {
    const percentage = Math.round((current / capacity) * 100);
    return `${current}/${capacity} (${percentage}%)`;
}