import { describe, it, expect, beforeEach, vi } from 'vitest'
import { countriesApi } from '@/services/countriesApi.js'

// Mock global fetch
global.fetch = vi.fn()

describe('countriesApi', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  describe('getAllCountries', () => {
    it('returns countries data on successful fetch', async () => {
      const mockData = [
        { name: { common: 'France' }, cca3: 'FRA' },
        { name: { common: 'Germany' }, cca3: 'DEU' }
      ]
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      })

      const result = await countriesApi.getAllCountries()
      
      expect(result.data).toEqual(mockData)
      expect(result.error).toBe(null)
      expect(fetch).toHaveBeenCalledWith(
        'https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,cca3'
      )
    })

    it('handles API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const result = await countriesApi.getAllCountries()
      
      expect(result.data).toBe(null)
      expect(result.error).toBe('HTTP error! status: 500')
    })

    it('handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await countriesApi.getAllCountries()
      
      expect(result.data).toBe(null)
      expect(result.error).toBe('Network error')
    })
  })

  describe('getCountryByCode', () => {
    it('returns single country data', async () => {
      const mockData = [{ name: { common: 'France' }, cca3: 'FRA' }]
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      })

      const result = await countriesApi.getCountryByCode('FRA')
      
      expect(result.data).toEqual(mockData[0])
      expect(result.error).toBe(null)
      expect(fetch).toHaveBeenCalledWith(
        'https://restcountries.com/v3.1/alpha/FRA'
      )
    })

    it('handles invalid country codes', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const result = await countriesApi.getCountryByCode('INVALID')
      
      expect(result.data).toBe(null)
      expect(result.error).toBe('HTTP error! status: 404')
    })
  })

  describe('searchCountries', () => {
    it('returns search results', async () => {
      const mockData = [{ name: { common: 'France' }, cca3: 'FRA' }]
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      })

      const result = await countriesApi.searchCountries('france')
      
      expect(result.data).toEqual(mockData)
      expect(result.error).toBe(null)
      expect(fetch).toHaveBeenCalledWith(
        'https://restcountries.com/v3.1/name/france?fields=name,capital,population,region,flags,cca3'
      )
    })

    it('handles no results found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const result = await countriesApi.searchCountries('nonexistent')
      
      expect(result.data).toBe(null)
      expect(result.error).toBe('HTTP error! status: 404')
    })
  })
})