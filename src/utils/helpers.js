// Format population number with commas
export function formatPopulation(population) {
  if (population === null || population === undefined) return 'N/A'
  return population.toLocaleString()
  }
  
  // Filter countries by search term
  export function filterCountries(countries, searchTerm) {
    if (!searchTerm) return countries
    
    const term = searchTerm.toLowerCase()
    return countries.filter(country => 
      country.name.common.toLowerCase().includes(term) ||
      country.name.official.toLowerCase().includes(term) ||
      (country.capital && country.capital[0].toLowerCase().includes(term)) ||
      country.region.toLowerCase().includes(term)
    )
  }
  
  // Sort countries by different criteria
  export function sortCountries(countries, sortBy = 'name') {
    const sorted = [...countries]
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.common.localeCompare(b.name.common))
      case 'population':
        return sorted.sort((a, b) => b.population - a.population)
      case 'region':
        return sorted.sort((a, b) => a.region.localeCompare(b.region))
      default:
        return sorted
    }
  }
  
  // Debounce function for search input
  export function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }