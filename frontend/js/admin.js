import { requireAdmin, apiCall, getOccupancyLevel } from './main.js'

let editingSpaceId = null
let deletingSpaceId = null
let currentPage = 1
// eslint-disable-next-line no-unused-vars
let totalPages = 1
let searchTimeout = null
const LIMIT = 10

async function init() {
  await requireAdmin()
  loadStats()
  loadSpaces()
}

async function loadStats() {
  try {
    const data = await apiCall('/api/spaces?limit=1000')
    const spaces = data.data || []
    const totalCapacity = spaces.reduce((sum, s) => sum + (s.capacity || 0), 0)
    const available = spaces.filter(
      (s) => ((s.currentOccupancy || 0) / s.capacity) * 100 < 60,
    ).length
    document.getElementById('totalSpaces').textContent =
      data.pagination?.totalSpaces ?? spaces.length
    document.getElementById('totalCapacity').textContent = totalCapacity
    document.getElementById('availableSpaces').textContent = available
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

async function loadSpaces(page = 1) {
  try {
    document.getElementById('loadingSpinner').style.display = 'block'
    document.getElementById('spacesTable').style.display = 'none'
    document.getElementById('noResults').style.display = 'none'
    removePagination()

    const searchTerm = document.getElementById('adminSearch').value.trim()
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('limit', LIMIT)
    if (searchTerm) params.append('search', searchTerm)

    const data = await apiCall(`/api/spaces?${params.toString()}`)
    const spaces = data.data || []
    currentPage = data.pagination.currentPage
    totalPages = data.pagination.totalPages

    document.getElementById('loadingSpinner').style.display = 'none'
    document.getElementById('spacesTable').style.display = 'table'

    renderTable(spaces)
    renderPagination(data.pagination)
  } catch (error) {
    console.error('Error loading spaces:', error)
    document.getElementById('loadingSpinner').style.display = 'none'
  }
}

function renderTable(spaces) {
  const tbody = document.getElementById('spacesTableBody')
  const noResults = document.getElementById('noResults')

  if (spaces.length === 0) {
    tbody.innerHTML = ''
    document.getElementById('spacesTable').style.display = 'none'
    noResults.style.display = 'block'
    return
  }

  noResults.style.display = 'none'
  tbody.innerHTML = spaces
    .map((space) => {
      const occupancyLevel = getOccupancyLevel(
        space.currentOccupancy || 0,
        space.capacity,
      )
      const pct = Math.round(
        ((space.currentOccupancy || 0) / space.capacity) * 100,
      )
      const statusLabel =
        occupancyLevel === 'low'
          ? 'Available'
          : occupancyLevel === 'medium'
            ? 'Filling Up'
            : 'Nearly Full'

      return `
            <tr>
                <td>
                    <div class="space-name">${space.name}</div>
                    ${space.location ? `<div class="space-location">${space.location}</div>` : ''}
                </td>
                <td>${space.building}</td>
                <td><span class="category-tag">${space.category}</span></td>
                <td>${space.capacity}</td>
                <td>
                    <div class="occupancy-bar-wrap">
                        <div class="occupancy-bar">
                            <div class="occupancy-bar-fill ${occupancyLevel}" style="width: ${pct}%"></div>
                        </div>
                        <span class="occupancy-pct">${space.currentOccupancy || 0}/${space.capacity}</span>
                    </div>
                </td>
                <td><span class="status-badge ${occupancyLevel}">${statusLabel}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon edit-btn" data-id="${space._id}">Edit</button>
                        <button class="btn-icon delete-btn danger" data-id="${space._id}" data-name="${space.name}">Delete</button>
                    </div>
                </td>
            </tr>
        `
    })
    .join('')

  tbody
    .querySelectorAll('.edit-btn')
    .forEach((btn) =>
      btn.addEventListener('click', () => openEditModal(btn.dataset.id)),
    )
  tbody
    .querySelectorAll('.delete-btn')
    .forEach((btn) =>
      btn.addEventListener('click', () =>
        openDeleteModal(btn.dataset.id, btn.dataset.name),
      ),
    )
}

function renderPagination(pagination) {
  if (pagination.totalPages <= 1) return

  const tableSection = document.querySelector('.table-section')
  const paginationEl = document.createElement('div')
  paginationEl.className = 'pagination'
  paginationEl.id = 'pagination'

  const prevBtn = document.createElement('button')
  prevBtn.className = `pagination-btn ${!pagination.hasPrevPage ? 'disabled' : ''}`
  prevBtn.textContent = '← Prev'
  prevBtn.disabled = !pagination.hasPrevPage
  prevBtn.addEventListener('click', () => {
    if (pagination.hasPrevPage) loadSpaces(currentPage - 1)
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
      btn.addEventListener('click', () => loadSpaces(p))
      pageNumbers.appendChild(btn)
    }
  })

  const nextBtn = document.createElement('button')
  nextBtn.className = `pagination-btn ${!pagination.hasNextPage ? 'disabled' : ''}`
  nextBtn.textContent = 'Next →'
  nextBtn.disabled = !pagination.hasNextPage
  nextBtn.addEventListener('click', () => {
    if (pagination.hasNextPage) loadSpaces(currentPage + 1)
  })

  paginationEl.appendChild(prevBtn)
  paginationEl.appendChild(pageNumbers)
  paginationEl.appendChild(nextBtn)
  tableSection.appendChild(paginationEl)
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

document.getElementById('adminSearch')?.addEventListener('input', () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage = 1
    loadSpaces(1)
  }, 400)
})

document.getElementById('addSpaceBtn').addEventListener('click', () => {
  editingSpaceId = null
  resetForm()
  document.getElementById('modalTitle').textContent = 'Add New Space'
  document.getElementById('saveSpaceBtn').textContent = 'Add Space'
  document.getElementById('spaceModal').style.display = 'flex'
})

document.getElementById('modalClose').addEventListener('click', closeSpaceModal)
document.getElementById('cancelBtn').addEventListener('click', closeSpaceModal)
document.getElementById('spaceModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('spaceModal')) closeSpaceModal()
})

function closeSpaceModal() {
  document.getElementById('spaceModal').style.display = 'none'
  resetForm()
}

function resetForm() {
  ;[
    'spaceName',
    'spaceBuilding',
    'spaceCapacity',
    'spaceLocation',
    'spaceDescription',
    'hoursWeekday',
    'hoursWeekend',
  ].forEach((id) => {
    document.getElementById(id).value = ''
  })
  document.getElementById('spaceCategory').value = ''
  document
    .querySelectorAll('.amenities-checkboxes input[type="checkbox"]')
    .forEach((cb) => (cb.checked = false))
  document.getElementById('formError').style.display = 'none'
}

async function openEditModal(spaceId) {
  try {
    const data = await apiCall(`/api/spaces/${spaceId}`)
    const space = data.space
    editingSpaceId = spaceId

    document.getElementById('modalTitle').textContent = 'Edit Space'
    document.getElementById('saveSpaceBtn').textContent = 'Save Changes'
    document.getElementById('spaceName').value = space.name || ''
    document.getElementById('spaceBuilding').value = space.building || ''
    document.getElementById('spaceCategory').value = space.category || ''
    document.getElementById('spaceCapacity').value = space.capacity || ''
    document.getElementById('spaceLocation').value = space.location || ''
    document.getElementById('spaceDescription').value = space.description || ''
    document.getElementById('hoursWeekday').value = space.hours?.weekday || ''
    document.getElementById('hoursWeekend').value = space.hours?.weekend || ''

    document
      .querySelectorAll('.amenities-checkboxes input[type="checkbox"]')
      .forEach((cb) => {
        cb.checked = space.amenities?.includes(cb.value) || false
      })

    document.getElementById('spaceModal').style.display = 'flex'
  } catch (error) {
    alert('Error loading space: ' + error.message)
  }
}

document.getElementById('saveSpaceBtn').addEventListener('click', async () => {
  const name = document.getElementById('spaceName').value.trim()
  const building = document.getElementById('spaceBuilding').value.trim()
  const category = document.getElementById('spaceCategory').value
  const capacity = parseInt(document.getElementById('spaceCapacity').value)
  const location = document.getElementById('spaceLocation').value.trim()
  const description = document.getElementById('spaceDescription').value.trim()
  const hoursWeekday = document.getElementById('hoursWeekday').value.trim()
  const hoursWeekend = document.getElementById('hoursWeekend').value.trim()
  const amenities = [
    ...document.querySelectorAll(
      '.amenities-checkboxes input[type="checkbox"]:checked',
    ),
  ].map((cb) => cb.value)

  if (!name || !building || !category || !capacity) {
    const formError = document.getElementById('formError')
    formError.textContent =
      'Please fill in all required fields (Name, Building, Category, Capacity).'
    formError.style.display = 'block'
    return
  }

  const payload = {
    name,
    building,
    category,
    capacity,
    location,
    description,
    amenities,
    hours: { weekday: hoursWeekday, weekend: hoursWeekend },
  }

  try {
    document.getElementById('saveSpaceBtn').textContent = 'Saving...'
    document.getElementById('saveSpaceBtn').disabled = true

    if (editingSpaceId) {
      await apiCall(`/api/spaces/${editingSpaceId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
    } else {
      await apiCall('/api/spaces', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    }

    closeSpaceModal()
    loadStats()
    loadSpaces(currentPage)
  } catch (error) {
    const formError = document.getElementById('formError')
    formError.textContent = error.message
    formError.style.display = 'block'
  } finally {
    document.getElementById('saveSpaceBtn').textContent = editingSpaceId
      ? 'Save Changes'
      : 'Add Space'
    document.getElementById('saveSpaceBtn').disabled = false
  }
})

function openDeleteModal(spaceId, spaceName) {
  deletingSpaceId = spaceId
  document.getElementById('deleteSpaceName').textContent = spaceName
  document.getElementById('deleteModal').style.display = 'flex'
}

document
  .getElementById('deleteModalClose')
  .addEventListener('click', closeDeleteModal)
document
  .getElementById('cancelDeleteBtn')
  .addEventListener('click', closeDeleteModal)
document.getElementById('deleteModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('deleteModal')) closeDeleteModal()
})

function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none'
  deletingSpaceId = null
}

document
  .getElementById('confirmDeleteBtn')
  .addEventListener('click', async () => {
    if (!deletingSpaceId) return

    try {
      document.getElementById('confirmDeleteBtn').textContent = 'Deleting...'
      document.getElementById('confirmDeleteBtn').disabled = true

      await apiCall(`/api/spaces/${deletingSpaceId}`, { method: 'DELETE' })
      closeDeleteModal()
      loadStats()
      loadSpaces(currentPage > 1 ? currentPage - 1 : 1)
    } catch (error) {
      alert('Error deleting space: ' + error.message)
    } finally {
      document.getElementById('confirmDeleteBtn').textContent = 'Delete'
      document.getElementById('confirmDeleteBtn').disabled = false
    }
  })

init()
