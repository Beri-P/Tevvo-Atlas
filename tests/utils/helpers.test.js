import { describe, it, expect } from 'vitest'
import { 
  formatPopulation, 
  filterCountries, 
  sortCountries, 
  debounce 
} from '@/utils/helpers.js'

describe('helpers.js', () => {
  describe('formatPopulation', () => {
    it('formats numbers with commas', () => {
      expect(formatPopulation(1000000)).toBe('1,000,000')
      expect(formatPopulation(123456789)).toBe('123,456,789')
    })

    it('handles null/undefined values', () => {
      expect(formatPopulation(null)).toBe('N/A')
      expect(formatPopulation(undefined)).toBe('N/A')
      expect(formatPopulation(0)).toBe('0')
    })
  })

  describe('filterCountries', () => {
    const mockCountries = [
      {
        name: { common: 'United States', official: 'United States of America' },
        capital: ['Washington, D.C.'],
        region: 'Americas'
      },
      {
        name: { common: 'France', official: 'French Republic' },
        capital: ['Paris'],
        region: 'Europe'
      },
      {
        name: { common: 'Japan', official: 'Japan' },
        capital: ['Tokyo'],
        region: 'Asia'
      }
    ]

    it('returns all countries when no search term', () => {
      expect(filterCountries(mockCountries, '')).toEqual(mockCountries)
      expect(filterCountries(mockCountries, null)).toEqual(mockCountries)
    })

    it('filters by country name', () => {
      const result = filterCountries(mockCountries, 'france')
      expect(result).toHaveLength(1)
      expect(result[0].name.common).toBe('France')
    })

    it('filters by capital', () => {
      const result = filterCountries(mockCountries, 'tokyo')
      expect(result).toHaveLength(1)
      expect(result[0].name.common).toBe('Japan')
    })

    it('filters by region', () => {
      const result = filterCountries(mockCountries, 'europe')
      expect(result).toHaveLength(1)
      expect(result[0].name.common).toBe('France')
    })

    it('is case insensitive', () => {
      const result = filterCountries(mockCountries, 'UNITED')
      expect(result).toHaveLength(1)
      expect(result[0].name.common).toBe('United States')
    })
  })

  describe('sortCountries', () => {
    const mockCountries = [
      {
        name: { common: 'Lion Country' },
        population: 1000000,
        region: 'Africa'
      },
      {
        name: { common: 'Bear Country' },
        population: 5000000,
        region: 'Europe'
      },
      {
        name: { common: 'Tiger Country' },
        population: 500000,
        region: 'Asia'
      }
    ]

    it('sorts by name (default)', () => {
      const result = sortCountries(mockCountries)
      expect(result[0].name.common).toBe('Bear Country')
      expect(result[1].name.common).toBe('Lion Country')
      expect(result[2].name.common).toBe('Tiger Country')
    })

    it('sorts by population (descending)', () => {
      const result = sortCountries(mockCountries, 'population')
      expect(result[0].population).toBe(5000000)
      expect(result[1].population).toBe(1000000)
      expect(result[2].population).toBe(500000)
    })

    it('sorts by region', () => {
      const result = sortCountries(mockCountries, 'region')
      expect(result[0].region).toBe('Africa')
      expect(result[1].region).toBe('Asia')
      expect(result[2].region).toBe('Europe')
    })

    it('does not mutate original array', () => {
      const original = [...mockCountries]
      sortCountries(mockCountries, 'name')
      expect(mockCountries).toEqual(original)
    })
  })

  describe('debounce', () => {
    it('delays function execution', async () => {
      let called = false
      const debouncedFn = debounce(() => { called = true }, 100)
      
      debouncedFn()
      expect(called).toBe(false)
      
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(called).toBe(true)
    })

    it('cancels previous calls', async () => {
      let callCount = 0
      const debouncedFn = debounce(() => { callCount++ }, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(callCount).toBe(1)
    })
  })
})