const TILE_SIZE = 0.5
const MAX_MARKERS = 200
const MAX_CACHED_TILES = 100
const MIN_ZOOM = 10

const CODE_TO_CATEGORY: Record<string, string> = {
  m: 'medical',
  e: 'evac',
  s: 'evac',
  p: 'police',
  f: 'police',
  g: 'store',
}

export const useFacilityData = () => {
  const { locale } = useI18n()

  const getLocalizedName = (r: FacilityTileRecord): string => {
    if (locale.value === 'en' && r.n_en) return r.n_en
    if (locale.value === 'zh' && r.n_zh) return r.n_zh
    return r.n
  }

  const getLocalizedAddress = (r: FacilityTileRecord): string => {
    if (locale.value === 'en' && r.a_en) return r.a_en
    if (locale.value === 'zh' && r.a_zh) return r.a_zh
    return r.a
  }

  const tileIndex = useState<Record<string, number> | null>('facility_tile_index', () => null)
  const tileCache = useState<Record<string, FacilityTileRecord[]>>('facility_tile_cache', () => ({}))
  const tileLRU = useState<string[]>('facility_tile_lru', () => [])
  const loadingTiles = useState<Record<string, boolean>>('facility_loading_tiles', () => ({}))
  const facilities = useState<LocationData[]>('facility_visible', () => [])
  const facilityCounts = useState<Record<string, number>>('facility_counts', () => ({}))
  const totalInBounds = ref(0)
  const isLoading = ref(false)
  const tooFarOut = ref(false)

  const init = async () => {
    if (tileIndex.value) return
    try {
      const res = await fetch('/data/tiles/index.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      tileIndex.value = await res.json()
    } catch (e) {
      console.error('Failed to load tile index:', e)
    }
  }

  const touchLRU = (key: string) => {
    const arr = tileLRU.value
    const idx = arr.indexOf(key)
    if (idx !== -1) arr.splice(idx, 1)
    arr.push(key)

    while (arr.length > MAX_CACHED_TILES) {
      const evict = arr.shift()!
      delete tileCache.value[evict]
    }
  }

  const fetchTile = async (key: string) => {
    if (tileCache.value[key] || loadingTiles.value[key]) return
    loadingTiles.value[key] = true
    try {
      const res = await fetch(`/data/tiles/${key}.json`)
      if (res.ok) {
        tileCache.value[key] = await res.json()
        touchLRU(key)
      }
    } catch {
      // silently fail for missing tiles
    } finally {
      delete loadingTiles.value[key]
    }
  }

  const getTileKeysForBounds = (
    south: number, west: number, north: number, east: number
  ): string[] => {
    const keys: string[] = []
    const minLat = Math.floor(south / TILE_SIZE)
    const maxLat = Math.floor(north / TILE_SIZE)
    const minLng = Math.floor(west / TILE_SIZE)
    const maxLng = Math.floor(east / TILE_SIZE)

    for (let la = minLat; la <= maxLat; la++) {
      for (let lo = minLng; lo <= maxLng; lo++) {
        const key = `${la}_${lo}`
        if (tileIndex.value && tileIndex.value[key]) {
          keys.push(key)
        }
      }
    }
    return keys
  }

  const updateViewport = async (
    bounds: google.maps.LatLngBounds,
    zoom: number,
    center: google.maps.LatLngLiteral,
    activeCategories: string[]
  ) => {
    if (!tileIndex.value) return

    if (zoom < MIN_ZOOM) {
      tooFarOut.value = true
      facilities.value = []
      return
    }
    tooFarOut.value = false

    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()
    const tileKeys = getTileKeysForBounds(sw.lat(), sw.lng(), ne.lat(), ne.lng())

    // Limit tile fetches to prevent too many requests
    const keysToFetch = tileKeys.filter(k => !tileCache.value[k]).slice(0, 20)

    if (keysToFetch.length > 0) {
      isLoading.value = true
      await Promise.all(keysToFetch.map(k => fetchTile(k)))
      isLoading.value = false
    }

    // Touch cached tiles used in this viewport
    tileKeys.forEach(k => {
      if (tileCache.value[k]) touchLRU(k)
    })

    // Gather all facilities from loaded tiles within exact bounds
    const south = sw.lat()
    const west = sw.lng()
    const north = ne.lat()
    const east = ne.lng()

    const all: LocationData[] = []
    const counts: Record<string, number> = {}
    for (const key of tileKeys) {
      const records = tileCache.value[key]
      if (!records) continue
      for (const r of records) {
        if (r.la < south || r.la > north || r.lo < west || r.lo > east) continue
        const appCategory = CODE_TO_CATEGORY[r.c]
        if (!appCategory || !activeCategories.includes(appCategory)) continue
        counts[appCategory] = (counts[appCategory] || 0) + 1
        all.push({
          lat: r.la,
          lng: r.lo,
          type: appCategory,
          title: getLocalizedName(r),
          address: getLocalizedAddress(r),
        })
      }
    }

    totalInBounds.value = all.length

    // Cap at MAX_MARKERS nearest to center
    if (all.length > MAX_MARKERS) {
      const cLat = center.lat
      const cLng = center.lng
      all.sort((a, b) => {
        const da = (a.lat - cLat) ** 2 + (a.lng - cLng) ** 2
        const db = (b.lat - cLat) ** 2 + (b.lng - cLng) ** 2
        return da - db
      })
      all.length = MAX_MARKERS
    }

    facilityCounts.value = counts
    facilities.value = all
  }

  const searchFacilities = (
    query: string,
    bounds: google.maps.LatLngBounds,
    activeCategories: string[]
  ): LocationData[] => {
    if (!query.trim()) return []

    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()
    const tileKeys = getTileKeysForBounds(sw.lat(), sw.lng(), ne.lat(), ne.lng())
    const lowerQuery = query.toLowerCase()

    const results: LocationData[] = []
    for (const key of tileKeys) {
      const records = tileCache.value[key]
      if (!records) continue
      for (const r of records) {
        const appCategory = CODE_TO_CATEGORY[r.c]
        if (!appCategory || !activeCategories.includes(appCategory)) continue
        const searchable = [r.n, r.a, r.n_en, r.a_en, r.n_zh, r.a_zh]
          .filter(Boolean).join(' ').toLowerCase()
        if (searchable.includes(lowerQuery)) {
          results.push({
            lat: r.la,
            lng: r.lo,
            type: appCategory,
            title: getLocalizedName(r),
            address: getLocalizedAddress(r),
          })
        }
      }
      if (results.length >= MAX_MARKERS) break
    }
    return results.slice(0, MAX_MARKERS)
  }

  return {
    init,
    updateViewport,
    searchFacilities,
    facilities,
    facilityCounts,
    totalInBounds,
    isLoading,
    tooFarOut,
  }
}
