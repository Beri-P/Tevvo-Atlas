const applySorting = () => {
  filteredCountries.value = sortCountries(filteredCountries.value, sortBy.value)
}<template>
  <div class="countries-container">
    <header class="app-header">
      <h1>ATLAS</h1>
      <div class="user-info">
        <span v-if="userEmail" class="user-email">{{ userEmail }}</span>
        <button @click="handleLogout" class="logout-btn">
          Logout
        </button>
      </div>
    </header>
    
    <main class="main-content">
      <!-- Search and Filter Section -->
      <div class="search-section">
        <div class="search-container">
          <input 
            v-model="searchTerm"
            type="text" 
            placeholder="Search countries by name, capital, or region..."
            class="search-input"
          />
          <div class="filter-controls">
            <select v-model="selectedRegion" class="region-filter">
              <option value="">All Regions</option>
              <option v-for="region in regions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
            <select v-model="sortBy" class="sort-select">
              <option value="name">Sort by Name</option>
              <option value="population">Sort by Population</option>
              <option value="region">Sort by Region</option>
            </select>
          </div>
        </div>
        
        <div class="results-info">
          <p>{{ filteredCountries.length }} countries found</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Loading countries...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <h3>Failed to load countries</h3>
        <p>{{ error }}</p>
        <button @click="fetchCountries" class="retry-btn">Try Again</button>
      </div>

      <!-- Countries Grid -->
      <div v-else class="countries-grid">
        <div 
          v-for="country in paginatedCountries" 
          :key="country.cca3"
          class="country-card"
          @click="goToCountryDetail(country.cca3)"
        >
          <div class="flag-container">
            <img 
              :src="country.flags.png" 
              :alt="`Flag of ${country.name.common}`"
              class="flag-image"
              loading="lazy"
            />
          </div>
          <div class="country-info">
            <h3 class="country-name">{{ country.name.common }}</h3>
            <div class="country-details">
              <p><strong>Capital:</strong> {{ getCapital(country) }}</p>
              <p><strong>Population:</strong> {{ formatPopulation(country.population) }}</p>
              <p><strong>Region:</strong> {{ country.region }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          Previous
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="['page-btn', { active: page === currentPage }]"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          Next
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/supabase.js'
import { countriesApi } from '@/services/countriesApi.js'
import { formatPopulation, filterCountries, sortCountries, debounce } from '@/utils/helpers.js'

const router = useRouter()

// Reactive state
const countries = ref([])
const filteredCountries = ref([])
const loading = ref(true)
const error = ref('')
const searchTerm = ref('')
const selectedRegion = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const countriesPerPage = 20
const userEmail = ref('')

// Computed properties
const regions = computed(() => {
  const uniqueRegions = [...new Set(countries.value.map(c => c.region))]
  return uniqueRegions.sort()
})

const totalPages = computed(() => {
  return Math.ceil(filteredCountries.value.length / countriesPerPage)
})

const paginatedCountries = computed(() => {
  const start = (currentPage.value - 1) * countriesPerPage
  const end = start + countriesPerPage
  return filteredCountries.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  // Always show first page
  if (total > 0) pages.push(1)
  
  // Show pages around current page
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    if (!pages.includes(i)) pages.push(i)
  }
  
  // Always show last page
  if (total > 1 && !pages.includes(total)) pages.push(total)
  
  return pages.sort((a, b) => a - b)
})

// Watchers for reactive filtering - only for search term
watch(searchTerm, () => {
  handleSearch()
}, { immediate: false })

// Watchers for reactive filtering
watch(searchTerm, () => {
  applyFilters()
})

watch(selectedRegion, () => {
  applyFilters()
})

watch(sortBy, () => {
  applyFilters()
})

// Methods
const fetchCountries = async () => {
  loading.value = true
  error.value = ''
  
  const { data, error: apiError } = await countriesApi.getAllCountries()
  
  if (apiError) {
    error.value = apiError
  } else {
    countries.value = data || []
    applyFilters()
  }
  
  loading.value = false
}

const handleSearch = debounce(() => {
  applyFilters()
}, 300)

const applyFilters = () => {
  let filtered = countries.value

  // Apply search filter
  if (searchTerm.value) {
    filtered = filterCountries(filtered, searchTerm.value)
  }

  // Apply region filter
  if (selectedRegion.value) {
    filtered = filtered.filter(country => country.region === selectedRegion.value)
  }

  filteredCountries.value = sortCountries(filtered, sortBy.value)
  currentPage.value = 1 // Reset to first page when filtering
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToCountryDetail = (countryCode) => {
  router.push(`/country/${countryCode}`)
}

const getCapital = (country) => {
  return country.capital && country.capital.length > 0 ? country.capital[0] : 'N/A'
}

const handleLogout = async () => {
  try {
    await authService.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    router.push('/login')
  }
}

const getCurrentUser = async () => {
  try {
    const { user } = await authService.getCurrentUser()
    if (user) {
      userEmail.value = user.email
    }
  } catch (error) {
    console.error('Error getting user:', error)
  }
}

// Lifecycle
onMounted(() => {
  getCurrentUser()
  fetchCountries()
})
</script>

<style scoped>
.countries-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.app-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  color: #333;
  margin: 0;
  font-size: 1.8rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-email {
  color: #666;
  font-size: 0.9rem;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background: #c82333;
}

.main-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.search-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.region-filter,
.sort-select {
  padding: 0.5rem;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  min-width: 150px;
}

.results-info {
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state h3 {
  color: #dc3545;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
}

.countries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.country-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.country-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.flag-container {
  height: 200px;
  overflow: hidden;
}

.flag-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.country-info {
  padding: 1.5rem;
}

.country-name {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.3rem;
}

.country-details p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.country-details strong {
  color: #333;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f8f9fa;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .app-header h1 {
    font-size: 1.5rem;
  }
  
  .user-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .search-section {
    padding: 1rem;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .region-filter,
  .sort-select {
    min-width: 100%;
  }
  
  .countries-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .page-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.9rem;
  }
}
</style>