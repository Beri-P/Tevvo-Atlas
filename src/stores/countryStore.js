import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { filterCountries, sortCountries } from '@/utils/helpers.js'
import { countriesApi } from '@/services/countriesApi.js'

export const useCountryStore = defineStore('country', () => {
  // state
  const all = ref([])
  const loading = ref(false)
  const error   = ref(null)

  const searchTerm     = ref('')
  const selectedRegion = ref('')
  const sortBy         = ref('name')
  const currentPage    = ref(1)
  const perPage        = 20

  // actions
  async function fetchAll() {
    loading.value = true
    error.value   = null
    const { data, error: e } = await countriesApi.getAllCountries()
    if (e) error.value = e
    else    all.value   = data || []
    loading.value = false
  }

  // getters
  const filtered = computed(() => {
    let list = all.value
    if (searchTerm.value)     list = filterCountries(list, searchTerm.value)
    if (selectedRegion.value) list = list.filter(c => c.region === selectedRegion.value)
    return sortCountries(list, sortBy.value)
  })

  const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))
  const paginated  = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return filtered.value.slice(start, start + perPage)
  })

  // expose
  return {
    // state
    all, loading, error,
    searchTerm, selectedRegion, sortBy, currentPage,

    // getters
    filtered, totalPages, paginated,

    // actions
    fetchAll,
  }
})