<template>
    <div class="country-detail-container">
      <header class="detail-header">
        <button @click="goBack" class="back-btn">
          ← Back to Countries
        </button>
        <h1>ATLAS</h1>
      </header>
  
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Loading country details...</p>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <h2>Country Not Found</h2>
        <p>{{ error }}</p>
        <button @click="fetchCountryData" class="retry-btn">Try Again</button>
      </div>
  
      <!-- Country Details -->
      <main v-else-if="country" class="country-details">
        <div class="country-header">
          <div class="flag-section">
            <img 
              :src="country.flags.svg" 
              :alt="`Flag of ${country.name.common}`"
              class="large-flag"
            />
          </div>
          <div class="country-title">
            <h1>{{ country.name.common }}</h1>
            <h2 class="official-name">{{ country.name.official }}</h2>
          </div>
        </div>
  
        <div class="details-grid">
          <!-- Basic Information -->
          <div class="info-card">
            <h3>Basic Information</h3>
            <div class="info-item">
              <strong>Capital:</strong>
              <span>{{ getCapital(country) }}</span>
            </div>
            <div class="info-item">
              <strong>Population:</strong>
              <span>{{ formatPopulation(country.population) }}</span>
            </div>
            <div class="info-item">
              <strong>Region:</strong>
              <span>{{ country.region }}</span>
            </div>
            <div class="info-item">
              <strong>Subregion:</strong>
              <span>{{ country.subregion || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <strong>Area:</strong>
              <span>{{ formatArea(country.area) }}</span>
            </div>
          </div>
  
          <!-- Geography -->
          <div class="info-card">
            <h3>Geography</h3>
            <div class="info-item">
              <strong>Continent:</strong>
              <span>{{ getContinents(country) }}</span>
            </div>
            <div class="info-item">
              <strong>Landlocked:</strong>
              <span>{{ country.landlocked ? 'Yes' : 'No' }}</span>
            </div>
            <div class="info-item">
              <strong>Borders:</strong>
              <span>{{ getBorders(country) }}</span>
            </div>
            <div v-if="country.latlng" class="info-item">
              <strong>Coordinates:</strong>
              <span>{{ country.latlng[0] }}°, {{ country.latlng[1] }}°</span>
            </div>
          </div>
  
          <!-- Languages & Currency -->
          <div class="info-card">
            <h3>Languages & Currency</h3>
            <div class="info-item">
              <strong>Languages:</strong>
              <span>{{ getLanguages(country) }}</span>
            </div>
            <div class="info-item">
              <strong>Currencies:</strong>
              <span>{{ getCurrencies(country) }}</span>
            </div>
          </div>
  
          <!-- Additional Info -->
          <div class="info-card">
            <h3>Additional Information</h3>
            <div class="info-item">
              <strong>UN Member:</strong>
              <span>{{ country.unMember ? 'Yes' : 'No' }}</span>
            </div>
            <div class="info-item">
              <strong>Independent:</strong>
              <span>{{ country.independent ? 'Yes' : 'No' }}</span>
            </div>
            <div v-if="country.timezones" class="info-item">
              <strong>Timezones:</strong>
              <span>{{ country.timezones.join(', ') }}</span>
            </div>
            <div v-if="country.tld" class="info-item">
              <strong>Top Level Domain:</strong>
              <span>{{ country.tld.join(', ') }}</span>
            </div>
          </div>
        </div>
  
        <!-- Coat of Arms -->
        <div v-if="country.coatOfArms && country.coatOfArms.svg" class="coat-of-arms-section">
          <h3>Coat of Arms</h3>
          <div class="coat-of-arms">
            <img 
              :src="country.coatOfArms.svg" 
              :alt="`Coat of Arms of ${country.name.common}`"
              class="coat-image"
            />
          </div>
        </div>
  
        <!-- Maps Links -->
        <div v-if="country.maps" class="maps-section">
          <h3>View on Maps</h3>
          <div class="maps-links">
            <a v-if="country.maps.googleMaps" :href="country.maps.googleMaps" target="_blank" class="map-link">
              📍 Google Maps
            </a>
            <a v-if="country.maps.openStreetMaps" :href="country.maps.openStreetMaps" target="_blank" class="map-link">
              🗺️ OpenStreetMap
            </a>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { countriesApi } from '@/services/countriesApi.js'
import { formatPopulation } from '@/utils/helpers.js'

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const router = useRouter()
const country = ref(null)
const loading = ref(true)
const error = ref('')

const fetchCountryData = async () => {
  loading.value = true
  error.value = ''
  
  const { data, error: apiError } = await countriesApi.getCountryByCode(props.code)
  
  if (apiError) {
    error.value = `Failed to load country data: ${apiError}`
  } else if (!data) {
    error.value = 'Country not found'
  } else {
    country.value = data
  }
  
  loading.value = false
}

const goBack = () => {
  router.push('/countries')
}

const getCapital = (country) => {
  return country.capital && country.capital.length > 0 ? country.capital.join(', ') : 'N/A'
}

const formatArea = (area) => {
  return area ? `${area.toLocaleString()} km²` : 'N/A'
}

const getContinents = (country) => {
  return country.continents && country.continents.length > 0 ? country.continents.join(', ') : 'N/A'
}

const getBorders = (country) => {
  return country.borders && country.borders.length > 0 ? country.borders.join(', ') : 'None'
}

const getLanguages = (country) => {
  if (!country.languages) return 'N/A'
  return Object.values(country.languages).join(', ')
}

const getCurrencies = (country) => {
  if (!country.currencies) return 'N/A'
  return Object.values(country.currencies)
    .map(currency => `${currency.name} (${currency.symbol || 'N/A'})`)
    .join(', ')
}

onMounted(() => {
  fetchCountryData()
})
</script>
  
  <style scoped>
 .country-detail-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.detail-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.back-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn:hover {
  background: #5a67d8;
}

.detail-header h1 {
  color: #333;
  margin: 0;
  font-size: 1.8rem;
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

.error-state h2 {
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

.country-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.country-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 2rem;
}

.flag-section {
  flex-shrink: 0;
}

.large-flag {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.country-title h1 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
}

.official-name {
  color: #666;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 400;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item strong {
  color: #333;
  min-width: 120px;
  flex-shrink: 0;
}

.info-item span {
  color: #666;
  text-align: right;
  flex: 1;
}

.coat-of-arms-section,
.maps-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.coat-of-arms-section h3,
.maps-section h3 {
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
}

.coat-of-arms {
  text-align: center;
}

.coat-image {
  max-width: 150px;
  max-height: 150px;
  object-fit: contain;
}

.maps-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.map-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.map-link:hover {
  background: #5a67d8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .detail-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .country-details {
    padding: 1rem;
  }
  
  .country-header {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .large-flag {
    width: 150px;
    height: 90px;
  }
  
  .country-title h1 {
    font-size: 2rem;
  }
}
  </style>