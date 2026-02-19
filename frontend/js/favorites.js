import {
  requireAuth,
  showAdminNavIfAdmin,
  apiCall,
  getOccupancyLevel,
  formatOccupancy,
  formatAmenity,
} from './main.js'

const favoritesGrid = document.getElementById('favoritesGrid')
const loadingSpinner = document.getElementById('loadingSpinner')
const noFavorites = document.getElementById('noFavorites')

async function init() {
  await requireAuth()
  showAdminNavIfAdmin()
  loadFavorites()
}

async function loadFavorites() {
  try {
    loadingSpinner.style.display = 'block'
    favoritesGrid.innerHTML = ''
    noFavorites.style.display = 'none'

    const data = await apiCall('/api/favorites')
    const favorites = data.favourites || []

    loadingSpinner.style.display = 'none'

    if (favorites.length === 0) {
      noFavorites.style.display = 'block'
      return
    }

    renderFavorites(favorites)
  } catch (error) {
    loadingSpinner.style.display = 'none'
    favoritesGrid.innerHTML = `<p class="error-message">Error loading favorites: ${error.message}</p>`
  }
}

function renderFavorites(favorites) {
  favoritesGrid.innerHTML = ''
  favorites.forEach((space) =>
    favoritesGrid.appendChild(createFavoriteCard(space)),
  )
}

function createFavoriteCard(space) {
  const card = document.createElement('div')
  card.className = 'space-card favorite-card'

  const occupancyLevel = getOccupancyLevel(
    space.currentOccupancy || 0,
    space.capacity,
  )
  const pct = Math.round(((space.currentOccupancy || 0) / space.capacity) * 100)
  const statusLabel =
    occupancyLevel === 'low'
      ? 'Available'
      : occupancyLevel === 'medium'
        ? 'Filling Up'
        : 'Nearly Full'
  const hoursText = space.is24Hours ? 'Open 24/7' : space.hours?.weekday || null
  const locationParts = []
  if (space.floor) locationParts.push(`Floor ${space.floor}`)
  if (space.location) locationParts.push(space.location)

  card.innerHTML = `
        <button class="remove-favorite" data-id="${space._id}" title="Remove from favorites">✕</button>
        <div class="space-card-header">
            <div class="space-card-header-left">
                <h3 class="space-card-title">${space.name}</h3>
                <p class="space-card-subtitle">${space.building}${locationParts.length ? ' · ' + locationParts.join(' · ') : ''}</p>
            </div>
            <div class="space-card-badges">
                <span class="badge-category">${space.category}</span>
                ${space.is24Hours ? `<span class="badge-24h">24/7</span>` : ''}
            </div>
        </div>
        <div class="space-card-body">
            <div class="occupancy-section">
                <div class="occupancy-row">
                    <span class="occupancy-label">Occupancy</span>
                    <div class="occupancy-numbers">
                        <span class="occupancy-count">${space.currentOccupancy || 0} / ${space.capacity}</span>
                        <span class="occupancy-badge ${occupancyLevel}">${statusLabel}</span>
                    </div>
                </div>
                <div class="occupancy-progress">
                    <div class="occupancy-progress-fill ${occupancyLevel}" style="width: ${pct}%"></div>
                </div>
            </div>
            <div class="info-row">
                <span class="info-item">${space.capacity} seats</span>
                ${hoursText ? `<span class="info-divider">·</span><span class="info-item">${hoursText}</span>` : ''}
            </div>
            ${space.description ? `<p class="space-description">${space.description}</p>` : ''}
            <div class="amenities">
                ${space.amenities?.length ? space.amenities.map((a) => `<span class="amenity-tag">${formatAmenity(a)}</span>`).join('') : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-primary checkin-btn" data-id="${space._id}">Check In</button>
                <button class="btn btn-secondary view-btn" data-id="${space._id}">View Details</button>
            </div>
        </div>
    `

  card
    .querySelector('.remove-favorite')
    .addEventListener('click', () => handleRemoveFavorite(space._id))
  card
    .querySelector('.checkin-btn')
    .addEventListener('click', () => handleCheckIn(space._id))
  card.querySelector('.view-btn').addEventListener('click', () => {
    window.location.href = `/spaces.html?space=${space._id}`
  })

  return card
}

async function handleCheckIn(spaceId) {
  try {
    await apiCall('/api/checkins/checkin', {
      method: 'POST',
      body: JSON.stringify({ spaceId }),
    })
    alert('Checked in successfully!')
    loadFavorites()
  } catch (error) {
    alert('Error checking in: ' + error.message)
  }
}

async function handleRemoveFavorite(spaceId) {
  if (!confirm('Remove this space from favorites?')) return
  try {
    await apiCall(`/api/favorites/remove/${spaceId}`, { method: 'DELETE' })
    alert('Removed from favorites')
    loadFavorites()
  } catch (error) {
    alert('Error removing favorite: ' + error.message)
  }
}

init()
