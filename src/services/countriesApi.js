// API service for fetching countries data
const BASE_URL = 'https://restcountries.com/v3.1'

export const countriesApi = {
  // Fetch all countries
  async getAllCountries() {
    try {
      const response = await fetch(`${BASE_URL}/all?fields=name,capital,population,region,flags,cca3`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching countries:', error)
      return { data: null, error: error.message }
    }
  },

  // Fetch single country by code
  async getCountryByCode(code) {
    try {
      const response = await fetch(`${BASE_URL}/alpha/${code}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { data: data[0], error: null }
    } catch (error) {
      console.error('Error fetching country:', error)
      return { data: null, error: error.message }
    }
  },

  // Search countries by name
  async searchCountries(name) {
    try {
      const response = await fetch(`${BASE_URL}/name/${name}?fields=name,capital,population,region,flags,cca3`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      console.error('Error searching countries:', error)
      return { data: null, error: error.message }
    }
  }
}