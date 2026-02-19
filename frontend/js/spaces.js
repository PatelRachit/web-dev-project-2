// Spaces Page JavaScript

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
const spacesGrid = document.getElementById('spacesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const noResults = document.getElementById('noResults');
const categoryFilter = document.getElementById('categoryFilter');
const buildingFilter = document.getElementById('buildingFilter');
const amenitiesFilter = document.getElementById('amenitiesFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const spaceModal = document.getElementById('spaceModal');
const spaceDetails = document.getElementById('spaceDetails');
const modalClose = document.querySelector('.modal-close');

let allSpaces = [];
let favoriteSpaceIds = new Set();

// Load user's favorites
async function loadFavorites() {
    try {
        const data = await apiCall('/api/favorites');
        const favorites = data.favourites || [];
        favoriteSpaceIds = new Set(favorites.map(fav => fav._id));
    } catch (error) {
        console.error('Error loading favorites:', error);
        favoriteSpaceIds = new Set();
    }
}

// Load spaces
async function loadSpaces() {
    try {
        loadingSpinner.style.display = 'block';
        spacesGrid.innerHTML = '';
        noResults.style.display = 'none';

        // Load favorites first
        await loadFavorites();

        const params = new URLSearchParams();
        
        if (categoryFilter.value) {
            params.append('category', categoryFilter.value);
        }
        
        if (buildingFilter.value) {
            params.append('building', buildingFilter.value);
        }

        // Handle amenities dropdown
        if (amenitiesFilter && amenitiesFilter.value) {
            params.append('amenities', amenitiesFilter.value);
        }

        const queryString = params.toString();
        const endpoint = queryString ? `/api/spaces?${queryString}` : '/api/spaces';
        
        const data = await apiCall(endpoint);
        allSpaces = data.data || [];

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
    const isFavorite = favoriteSpaceIds.has(space._id);

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
                ${space.amenities ? space.amenities.map(a => `<span class="amenity-tag">${formatAmenity(a)}</span>`).join(' ') : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-primary view-details-btn" data-id="${space._id}">View Details</button>
                <button class="btn btn-secondary favorite-btn ${isFavorite ? 'is-favorite' : ''}" data-id="${space._id}">♥</button>
            </div>
        </div>
    `;

    // View details button
    const viewDetailsBtn = card.querySelector('.view-details-btn');
    viewDetailsBtn.addEventListener('click', () => showSpaceDetails(space._id));

    // Favorite button
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => handleToggleFavorite(space._id, favoriteBtn));

    return card;
}

// Show space details in modal
async function showSpaceDetails(spaceId) {
    try {
        const data = await apiCall(`/api/spaces/${spaceId}`);
        const space = data.space;
        
        const occupancyLevel = getOccupancyLevel(space.currentOccupancy || 0, space.capacity);
        const occupancyText = formatOccupancy(space.currentOccupancy || 0, space.capacity);
        const isFavorite = favoriteSpaceIds.has(space._id);

        spaceDetails.innerHTML = `
            <div class="space-detail-header">
                <h2>${space.name}</h2>
                <p>${space.building} - ${space.location || ''}</p>
            </div>
            
            <div class="space-detail-occupancy">
                <h3>Current Occupancy</h3>
                <p class="occupancy-text">${occupancyText}</p>
                <span class="occupancy-badge ${occupancyLevel}">
                    ${occupancyLevel === 'low' ? 'Available' : occupancyLevel === 'medium' ? 'Filling Up' : 'Nearly Full'}
                </span>
            </div>

            <div class="space-detail-info">
                <h3>About</h3>
                <p><strong>Category:</strong> ${space.category}</p>
                <p><strong>Capacity:</strong> ${space.capacity} seats</p>
                ${space.description ? `<p><strong>Description:</strong> ${space.description}</p>` : ''}
                ${space.hours ? `<p><strong>Hours:</strong> ${space.hours.weekday || 'Not specified'}</p>` : ''}
            </div>

            <div class="space-detail-amenities">
                <h3>Amenities</h3>
                <div class="amenities">
                    ${space.amenities ? space.amenities.map(a => `<span class="amenity-tag">${formatAmenity(a)}</span>`).join(' ') : 'None listed'}
                </div>
            </div>

            <div class="space-detail-actions">
                <button class="btn btn-primary" id="modalCheckinBtn">Check In Here</button>
                <button class="btn btn-secondary ${isFavorite ? 'is-favorite' : ''}" id="modalFavoriteBtn">
                    ${isFavorite ? '♥ Remove from Favorites' : '♡ Add to Favorites'}
                </button>
            </div>
        `;

        spaceModal.style.display = 'flex';

        // Modal check-in button
        document.getElementById('modalCheckinBtn').addEventListener('click', async () => {
            await handleCheckIn(spaceId);
            spaceModal.style.display = 'none';
        });

        // Modal favorite button
        const modalFavoriteBtn = document.getElementById('modalFavoriteBtn');
        modalFavoriteBtn.addEventListener('click', async () => {
            await handleToggleFavorite(spaceId, modalFavoriteBtn);
            // Update the button text and class
            const nowFavorite = favoriteSpaceIds.has(spaceId);
            modalFavoriteBtn.textContent = nowFavorite ? '♥ Remove from Favorites' : '♡ Add to Favorites';
            modalFavoriteBtn.classList.toggle('is-favorite', nowFavorite);
        });

    } catch (error) {
        alert('Error loading space details: ' + error.message);
    }
}

// Close modal
modalClose?.addEventListener('click', () => {
    spaceModal.style.display = 'none';
});

// Close modal on outside click
spaceModal?.addEventListener('click', (e) => {
    if (e.target === spaceModal) {
        spaceModal.style.display = 'none';
    }
});

// Handle check-in
async function handleCheckIn(spaceId) {
    try {
        await apiCall('/api/checkins/checkin', {
            method: 'POST',
            body: JSON.stringify({ spaceId })
        });
        alert('Checked in successfully!');
        loadSpaces();
    } catch (error) {
        alert('Error checking in: ' + error.message);
    }
}

// Handle toggle favorite
async function handleToggleFavorite(spaceId, buttonElement) {
    try {
        const isFavorite = favoriteSpaceIds.has(spaceId);
        
        if (isFavorite) {
            // Remove from favorites
            await apiCall(`/api/favorites/remove/${spaceId}`, {
                method: 'DELETE'
            });
            favoriteSpaceIds.delete(spaceId);
            buttonElement.classList.remove('is-favorite');
            alert('Removed from favorites!');
        } else {
            // Add to favorites
            await apiCall('/api/favorites/add', {
                method: 'POST',
                body: JSON.stringify({ spaceId })
            });
            favoriteSpaceIds.add(spaceId);
            buttonElement.classList.add('is-favorite');
            alert('Added to favorites!');
        }
    } catch (error) {
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

// Filter handlers
categoryFilter?.addEventListener('change', loadSpaces);
buildingFilter?.addEventListener('change', loadSpaces);
amenitiesFilter?.addEventListener('change', loadSpaces);

// Clear filters
clearFiltersBtn?.addEventListener('click', () => {
    categoryFilter.value = '';
    buildingFilter.value = '';
    if (amenitiesFilter) amenitiesFilter.value = '';
    loadSpaces();
});

loadSpaces();