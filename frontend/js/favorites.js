// Favorites Page JavaScript

import { 
    requireAuth, 
    apiCall, 
    getOccupancyLevel, 
    formatOccupancy,
    formatAmenity
} from './main.js';

// Check authentication
if (!requireAuth()) {
    throw new Error('Not authenticated');
}

// DOM Elements
const favoritesGrid = document.getElementById('favoritesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const noFavorites = document.getElementById('noFavorites');

// Load favorites
async function loadFavorites() {
    try {
        loadingSpinner.style.display = 'block';
        favoritesGrid.innerHTML = '';
        noFavorites.style.display = 'none';

        const data = await apiCall('/api/favorites');
        const favorites = data.favourites || [];

        loadingSpinner.style.display = 'none';

        if (favorites.length === 0) {
            noFavorites.style.display = 'block';
            return;
        }

        renderFavorites(favorites);
    } catch (error) {
        console.error('Error loading favorites:', error);
        loadingSpinner.style.display = 'none';
        favoritesGrid.innerHTML = `<p class="error-message">Error loading favorites: ${error.message}</p>`;
    }
}

// Render favorites
function renderFavorites(favorites) {
    favoritesGrid.innerHTML = '';

    favorites.forEach(space => {
        const card = createFavoriteCard(space);
        favoritesGrid.appendChild(card);
    });
}

// Create favorite card
function createFavoriteCard(space) {
    const card = document.createElement('div');
    card.className = 'space-card favorite-card';

    const occupancyLevel = getOccupancyLevel(space.currentOccupancy || 0, space.capacity);
    const occupancyText = formatOccupancy(space.currentOccupancy || 0, space.capacity);

    card.innerHTML = `
        <button class="remove-favorite" data-id="${space._id}" title="Remove from favorites">
            ✕
        </button>
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
                ${space.amenities ? space.amenities.map(a => `<span class="amenity-tag">${formatAmenity(a)}</span>`).join(' ') : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-primary checkin-btn" data-id="${space._id}">Check In</button>
                <button class="btn btn-secondary view-btn" data-id="${space._id}">View Details</button>
            </div>
        </div>
    `;

    // Remove from favorites button
    const removeBtn = card.querySelector('.remove-favorite');
    removeBtn.addEventListener('click', () => handleRemoveFavorite(space._id));

    // Check-in button
    const checkinBtn = card.querySelector('.checkin-btn');
    checkinBtn.addEventListener('click', () => handleCheckIn(space._id));

    // View details button
    const viewBtn = card.querySelector('.view-btn');
    viewBtn.addEventListener('click', () => {
        window.location.href = `/spaces.html?space=${space._id}`;
    });

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
        loadFavorites();
    } catch (error) {
        alert('Error checking in: ' + error.message);
    }
}

// Handle remove favorite
async function handleRemoveFavorite(spaceId) {
    if (!confirm('Remove this space from favorites?')) {
        return;
    }

    try {
        await apiCall(`/api/favorites/remove/${spaceId}`, {
            method: 'DELETE'
        });
        alert('Removed from favorites');
        loadFavorites();
    } catch (error) {
        alert('Error removing favorite: ' + error.message);
    }
}

loadFavorites();