// Dashboard JavaScript

import { 
    requireAuth, 
    apiCall, 
    getOccupancyLevel, 
    formatOccupancy 
} from './main.js';

// Check authentication
if (!requireAuth()) {
    throw new Error('Not authenticated');
}

// DOM Elements
const spacesGrid = document.getElementById('spacesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const noResults = document.getElementById('noResults');
const statusText = document.getElementById('statusText');
const checkoutBtn = document.getElementById('checkoutBtn');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const buildingFilter = document.getElementById('buildingFilter');
const amenityFilters = document.querySelectorAll('.amenity-filter');
const clearFiltersBtn = document.getElementById('clearFilters');

let allSpaces = [];
let activeCheckin = null;

// Load active check-in status
async function loadActiveCheckin() {
    try {
        const data = await apiCall('/api/checkins/active');
        activeCheckin = data.activeCheckIn;
        
        if (activeCheckin && activeCheckin.space) {
            const duration = calculateDuration(activeCheckin.checkInTime);
            statusText.textContent = `Checked in at ${activeCheckin.space.name} (${duration})`;
            checkoutBtn.style.display = 'block';
        } else {
            statusText.textContent = 'Not currently checked in';
            checkoutBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading check-in status:', error);
    }
}

// Calculate duration
function calculateDuration(checkInTime) {
    const start = new Date(checkInTime);
    const now = new Date();
    const diff = now - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

// Checkout handler
checkoutBtn?.addEventListener('click', async () => {
    try {
        await apiCall('/api/checkins/checkout', { method: 'POST' });
        alert('Checked out successfully!');
        loadActiveCheckin();
        loadSpaces();
    } catch (error) {
        alert('Error checking out: ' + error.message);
    }
});

// Load all spaces
async function loadSpaces() {
    try {
        loadingSpinner.style.display = 'block';
        spacesGrid.innerHTML = '';
        noResults.style.display = 'none';

        const params = new URLSearchParams();
        
        if (categoryFilter.value) {
            params.append('category', categoryFilter.value);
        }
        
        if (buildingFilter.value) {
            params.append('building', buildingFilter.value);
        }

        const selectedAmenities = Array.from(amenityFilters)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        if (selectedAmenities.length > 0) {
            params.append('amenities', selectedAmenities.join(','));
        }

        const queryString = params.toString();
        const endpoint = queryString ? `/api/spaces?${queryString}` : '/api/spaces';
        
        const data = await apiCall(endpoint);
        allSpaces = data.spaces || [];

        loadingSpinner.style.display = 'none';

        if (allSpaces.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        renderSpaces(allSpaces);
        populateBuildingFilter();
    } catch (error) {
        console.error('Error loading spaces:', error);
        loadingSpinner.style.display = 'none';
        spacesGrid.innerHTML = `<p class="error-message">Error loading spaces: ${error.message}</p>`;
    }
}

// Render spaces
function renderSpaces(spaces) {
    spacesGrid.innerHTML = '';

    spaces.forEach(space => {
        const card = createSpaceCard(space);
        spacesGrid.appendChild(card);
    });
}

// Create space card
function createSpaceCard(space) {
    const card = document.createElement('div');
    card.className = 'space-card';

    const occupancyLevel = getOccupancyLevel(space.currentOccupancy || 0, space.capacity);
    const occupancyText = formatOccupancy(space.currentOccupancy || 0, space.capacity);

    card.innerHTML = `
        <div class="space-card-header">
            <h3 class="space-card-title">${space.name}</h3>
            <p class="space-card-subtitle">${space.building} - ${space.category}</p>
        </div>
        <div class="space-card-body">
            <div class="occupancy">
                <span class="occupancy-text">${occupancyText}</span>
                <span class="occupancy-badge ${occupancyLevel}">
                    ${occupancyLevel === 'low' ? 'Available' : occupancyLevel === 'medium' ? 'Filling Up' : 'Nearly Full'}
                </span>
            </div>
            <div class="amenities">
                ${space.amenities ? space.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('') : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-primary checkin-btn" data-id="${space._id}">Check In</button>
                <button class="btn btn-secondary favorite-btn" data-id="${space._id}">♥</button>
            </div>
        </div>
    `;

    // Check-in button handler
    const checkinBtn = card.querySelector('.checkin-btn');
    checkinBtn.addEventListener('click', () => handleCheckIn(space._id));

    // Favorite button handler
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => handleToggleFavorite(space._id));

    return card;
}

// Handle check-in
async function handleCheckIn(spaceId) {
    try {
        await apiCall('/api/checkins/checkin', {
            method: 'POST',
            body: JSON.stringify({ spaceId })
        });
        alert('Checked in successfully!');
        loadActiveCheckin();
        loadSpaces();
    } catch (error) {
        alert('Error checking in: ' + error.message);
    }
}

// Handle toggle favorite
async function handleToggleFavorite(spaceId) {
    try {
        await apiCall('/api/favorites/add', {
            method: 'POST',
            body: JSON.stringify({ spaceId })
        });
        alert('Added to favorites!');
    } catch (error) {
        console.error('Error adding favorite:', error);
        alert('Error: ' + error.message);
    }
}

// Populate building filter
function populateBuildingFilter() {
    const buildings = [...new Set(allSpaces.map(s => s.building))];
    buildingFilter.innerHTML = '<option value="">All Buildings</option>';
    buildings.forEach(building => {
        const option = document.createElement('option');
        option.value = building;
        option.textContent = building;
        buildingFilter.appendChild(option);
    });
}

// Search functionality
searchInput?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allSpaces.filter(space => 
        space.name.toLowerCase().includes(searchTerm) ||
        space.building.toLowerCase().includes(searchTerm)
    );
    renderSpaces(filtered);
});

// Filter handlers
categoryFilter?.addEventListener('change', loadSpaces);
buildingFilter?.addEventListener('change', loadSpaces);
amenityFilters.forEach(filter => {
    filter.addEventListener('change', loadSpaces);
});

// Clear filters
clearFiltersBtn?.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = '';
    buildingFilter.value = '';
    amenityFilters.forEach(filter => filter.checked = false);
    loadSpaces();
});

// Initial load
loadActiveCheckin();
loadSpaces();