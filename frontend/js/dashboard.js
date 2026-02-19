import {
  requireAuth,
  showAdminNavIfAdmin,
  apiCall,
  getOccupancyLevel,
  formatAmenity,
} from './main.js'

const spacesGrid = document.getElementById('spacesGrid')
const loadingSpinner = document.getElementById('loadingSpinner')
const noResults = document.getElementById('noResults')
const statusText = document.getElementById('statusText')
const checkoutBtn = document.getElementById('checkoutBtn')
const searchInput = document.getElementById('searchInput')
const categoryFilter = document.getElementById('categoryFilter')
const buildingFilter = document.getElementById('buildingFilter')
const amenitiesFilter = document.getElementById('amenitiesFilter')
const clearFiltersBtn = document.getElementById('clearFilters')

let allSpaces = []
let activeCheckin = null
let favoriteSpaceIds = new Set()
let currentCheckedInSpaceId = null
let currentPage = 1
// eslint-disable-next-line no-unused-vars
let totalPages = 1
let searchTimeout = null
const LIMIT = 9

async function init() {
  await requireAuth()
  showAdminNavIfAdmin()
  loadActiveCheckin()
  loadSpaces()
}

async function loadFavorites() {
  try {
    const data = await apiCall('/api/favorites')
    const favorites = data.favourites || []
    favoriteSpaceIds = new Set(favorites.map((fav) => fav._id))
  } catch {
    favoriteSpaceIds = new Set()
  }
}

async function loadActiveCheckin() {
  try {
    const data = await apiCall('/api/checkins/active')
    activeCheckin = data.activeCheckIn
    const banner = document.getElementById('statusBanner')

    if (activeCheckin?.space) {
      currentCheckedInSpaceId = activeCheckin.space._id
      const duration = calculateDuration(activeCheckin.checkInTime)
      statusText.textContent = `Checked in at ${activeCheckin.space.name} (${duration})`
      checkoutBtn.style.display = 'inline-flex'
      banner.style.display = 'flex'
    } else {
      currentCheckedInSpaceId = null
      banner.style.display = 'none'
    }
  } catch {
    currentCheckedInSpaceId = null
    document.getElementById('statusBanner').style.display = 'none'
  }
}

function calculateDuration(checkInTime) {
  const diff = new Date() - new Date(checkInTime)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

checkoutBtn?.addEventListener('click', async () => {
  try {
    await apiCall('/api/checkins/checkout', { method: 'POST' })
    alert('Checked out successfully!')
    loadActiveCheckin()
    loadSpaces()
  } catch (error) {
    alert('Error checking out: ' + error.message)
  }
})

async function loadSpaces(page = 1) {
  try {
    loadingSpinner.style.display = 'block'
    spacesGrid.innerHTML = ''
    noResults.style.display = 'none'
    removePagination()

    await loadFavorites()

    const params = new URLSearchParams()
    if (categoryFilter.value) params.append('category', categoryFilter.value)
    if (buildingFilter.value) params.append('building', buildingFilter.value)
    if (amenitiesFilter?.value)
      params.append('amenities', amenitiesFilter.value)
    if (searchInput?.value.trim())
      params.append('search', searchInput.value.trim())
    params.append('page', page)
    params.append('limit', LIMIT)

    const data = await apiCall(`/api/spaces?${params.toString()}`)
    allSpaces = data.data || []
    currentPage = data.pagination.currentPage
    totalPages = data.pagination.totalPages

    loadingSpinner.style.display = 'none'

    if (allSpaces.length === 0) {
      noResults.style.display = 'block'
      return
    }

    renderSpaces(allSpaces)
    populateBuildingFilter()
    renderPagination(data.pagination)
  } catch (error) {
    loadingSpinner.style.display = 'none'
    spacesGrid.innerHTML = `<p class="error-message">Error loading spaces: ${error.message}</p>`
  }
}

function renderSpaces(spaces) {
  spacesGrid.innerHTML = ''
  spaces.forEach((space) => spacesGrid.appendChild(createSpaceCard(space)))
}

function createSpaceCard(space) {
  const card = document.createElement('div')
  card.className = 'space-card'

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
  const isFavorite = favoriteSpaceIds.has(space._id)
  const isCheckedIn = currentCheckedInSpaceId === space._id
  const hoursText = space.is24Hours ? 'Open 24/7' : space.hours?.weekday || null
  const locationParts = []
  if (space.floor) locationParts.push(`Floor ${space.floor}`)
  if (space.location) locationParts.push(space.location)

  card.innerHTML = `
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
                <button class="btn ${isCheckedIn ? 'btn-success' : 'btn-primary'} checkin-btn" data-id="${space._id}" ${isCheckedIn ? 'disabled' : ''}>
                    ${isCheckedIn ? '✓ Checked In' : 'Check In'}
                </button>
                <button class="btn btn-secondary favorite-btn ${isFavorite ? 'is-favorite' : ''}" data-id="${space._id}">
                    ${isFavorite ? 'Remove Favourite' : 'Add Favourite'}
                </button>
            </div>
        </div>
    `

  card
    .querySelector('.checkin-btn')
    .addEventListener('click', () => handleCheckIn(space._id))
  card
    .querySelector('.favorite-btn')
    .addEventListener('click', (e) =>
      handleToggleFavorite(space._id, e.currentTarget),
    )
  return card
}

function renderPagination(pagination) {
  if (pagination.totalPages <= 1) return

  const section = document.querySelector('.spaces-section')
  const paginationEl = document.createElement('div')
  paginationEl.className = 'pagination'
  paginationEl.id = 'pagination'

  const prevBtn = document.createElement('button')
  prevBtn.className = `pagination-btn ${!pagination.hasPrevPage ? 'disabled' : ''}`
  prevBtn.textContent = '← Prev'
  prevBtn.disabled = !pagination.hasPrevPage
  prevBtn.addEventListener('click', () => {
    if (pagination.hasPrevPage) {
      loadSpaces(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  const pageNumbers = document.createElement('div')
  pageNumbers.className = 'pagination-numbers'
  getPageRange(pagination.currentPage, pagination.totalPages).forEach((p) => {
    if (p === '...') {
      const dots = document.createElement('span')
      dots.className = 'pagination-dots'
      dots.textContent = '...'
      pageNumbers.appendChild(dots)
    } else {
      const btn = document.createElement('button')
      btn.className = `pagination-number ${p === pagination.currentPage ? 'active' : ''}`
      btn.textContent = p
      btn.addEventListener('click', () => {
        loadSpaces(p)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
      pageNumbers.appendChild(btn)
    }
  })

  const nextBtn = document.createElement('button')
  nextBtn.className = `pagination-btn ${!pagination.hasNextPage ? 'disabled' : ''}`
  nextBtn.textContent = 'Next →'
  nextBtn.disabled = !pagination.hasNextPage
  nextBtn.addEventListener('click', () => {
    if (pagination.hasNextPage) {
      loadSpaces(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  paginationEl.appendChild(prevBtn)
  paginationEl.appendChild(pageNumbers)
  paginationEl.appendChild(nextBtn)
  section.appendChild(paginationEl)
}

function getPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3)
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}

function removePagination() {
  document.getElementById('pagination')?.remove()
}

async function handleCheckIn(spaceId) {
  try {
    await apiCall('/api/checkins/checkin', {
      method: 'POST',
      body: JSON.stringify({ spaceId }),
    })
    alert('Checked in successfully!')
    loadActiveCheckin()
    loadSpaces(currentPage)
  } catch (error) {
    alert('Error checking in: ' + error.message)
  }
}

async function handleToggleFavorite(spaceId, buttonElement) {
  try {
    const isFavorite = favoriteSpaceIds.has(spaceId)
    if (isFavorite) {
      await apiCall(`/api/favorites/remove/${spaceId}`, { method: 'DELETE' })
      favoriteSpaceIds.delete(spaceId)
      buttonElement.classList.remove('is-favorite')
      buttonElement.textContent = 'Add Favourite'
    } else {
      await apiCall('/api/favorites/add', {
        method: 'POST',
        body: JSON.stringify({ spaceId }),
      })
      favoriteSpaceIds.add(spaceId)
      buttonElement.classList.add('is-favorite')
      buttonElement.textContent = 'Remove Favourite'
    }
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

function populateBuildingFilter() {
  const buildings = [...new Set(allSpaces.map((s) => s.building))]
  buildingFilter.innerHTML = '<option value="">All Buildings</option>'
  buildings.forEach((building) => {
    const option = document.createElement('option')
    option.value = building
    option.textContent = building
    buildingFilter.appendChild(option)
  })
}

searchInput?.addEventListener('input', () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage = 1
    loadSpaces(1)
  }, 400)
})

categoryFilter?.addEventListener('change', () => {
  currentPage = 1
  loadSpaces(1)
})
buildingFilter?.addEventListener('change', () => {
  currentPage = 1
  loadSpaces(1)
})
amenitiesFilter?.addEventListener('change', () => {
  currentPage = 1
  loadSpaces(1)
})

clearFiltersBtn?.addEventListener('click', () => {
  if (searchInput) searchInput.value = ''
  categoryFilter.value = ''
  buildingFilter.value = ''
  if (amenitiesFilter) amenitiesFilter.value = ''
  currentPage = 1
  loadSpaces(1)
})

init()