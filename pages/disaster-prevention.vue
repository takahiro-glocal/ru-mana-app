<template>
  <div class="tw-relative tw-w-full tw-h-screen tw-overflow-hidden tw-font-sans">

    <!-- ===== Header ===== -->
    <header class="tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-h-14 md:tw-h-16 tw-bg-white/90 tw-backdrop-blur-md tw-shadow-sm tw-z-50 tw-flex tw-items-center tw-justify-between tw-px-4 md:tw-px-6">
      <div class="tw-flex tw-items-center tw-gap-3">
        <button @click="$router.push(localePath('/'))" class="tw-p-1.5 tw-rounded-full hover:tw-bg-gray-100 tw-transition-colors md:tw-hidden">
          <ChevronLeft class="tw-w-6 tw-h-6 tw-text-gray-500" />
        </button>
        <NuxtLink :to="localePath('/')" class="tw-hidden md:tw-flex tw-items-center tw-gap-3">
          <img src="/images/logo.png" alt="るうまな" class="tw-w-8 tw-h-8 tw-rounded-full" />
        </NuxtLink>
        <div>
          <h1 class="tw-text-lg md:tw-text-2xl tw-font-bold tw-text-gray-800">{{ $t('disaster.title') }}</h1>
          <span class="tw-hidden md:tw-inline tw-text-xs tw-text-gray-500">{{ $t('disaster.subtitle') }}</span>
        </div>
      </div>

      <div class="tw-flex tw-items-center tw-gap-3 md:tw-gap-5">
        <NuxtLink :to="localePath('/trouble')" class="tw-flex tw-items-center tw-gap-1 tw-bg-[#E4007F] tw-text-white tw-px-3 tw-py-1.5 tw-rounded-full tw-text-xs tw-font-bold tw-shadow-sm hover:tw-bg-[#c0006b] tw-transition-colors">
          <AlertTriangle class="tw-w-3.5 tw-h-3.5" />
          <span class="tw-hidden md:tw-inline">{{ $t('common.trouble') }}</span>
          <span class="md:tw-hidden">SOS</span>
        </NuxtLink>
        <button class="tw-hidden md:tw-flex tw-items-center tw-justify-center hover:tw-opacity-70" @click="$router.push(localePath('/'))">
          <Home class="tw-w-6 tw-h-6 tw-text-gray-400 hover:tw-text-[#85C441]" />
        </button>
        <div v-if="user" @click="openDrawer()" class="tw-cursor-pointer">
          <img :src="userPhotoURL" class="tw-w-8 tw-h-8 md:tw-w-9 md:tw-h-9 tw-rounded-full tw-border tw-border-gray-200" />
        </div>
        <UserCircle v-else class="tw-w-8 tw-h-8 tw-text-gray-400 tw-cursor-pointer" @click="isLoginModalOpen = true" />
      </div>
    </header>

    <!-- ===== PC: Sidebar ===== -->
    <aside
      class="tw-hidden md:tw-flex tw-absolute tw-top-24 tw-left-6 tw-w-72 tw-flex-col tw-gap-4 tw-z-40 tw-transition-transform tw-duration-300"
      :class="isSidebarOpen ? 'tw-translate-x-0' : '-tw-translate-x-[110%]'"
    >
      <div class="tw-bg-white/80 tw-backdrop-blur-md tw-rounded-2xl tw-p-2 tw-shadow-lg tw-border tw-border-white/50">
        <div class="tw-relative">
          <input type="text" :placeholder="$t('disaster.search_facilities')" class="tw-w-full tw-bg-white tw-rounded-xl tw-py-2 tw-pl-10 tw-pr-8 tw-text-sm tw-outline-none focus:tw-ring-2 focus:tw-ring-[#85C441]/50 tw-text-gray-700" />
          <Search class="tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-w-4 tw-h-4 tw-text-gray-400" />
        </div>
      </div>

      <div class="tw-bg-white/80 tw-backdrop-blur-md tw-rounded-3xl tw-p-4 tw-shadow-lg tw-border tw-border-white/50 tw-space-y-2">
        <button
          v-for="cat in categories" :key="cat.id"
          @click="toggleCategory(cat.id)"
          class="tw-w-full tw-flex tw-items-center tw-gap-3 tw-p-3 tw-rounded-xl tw-transition-all hover:tw-bg-white/60"
          :class="{'tw-bg-white tw-shadow-sm': cat.active, 'tw-opacity-60': !cat.active}"
        >
          <div class="tw-w-4 tw-h-4 tw-rounded-full tw-shadow-sm" :style="{ backgroundColor: cat.color }"></div>
          <span class="tw-text-sm tw-font-bold tw-text-gray-600">{{ cat.label }}</span>
          <div v-if="cat.active" class="tw-ml-auto tw-w-2 tw-h-2 tw-rounded-full tw-bg-gray-400"></div>
        </button>

        <div class="tw-pt-4 tw-mt-4 tw-border-t tw-border-gray-200/50">
          <button @click="openDrawer('feedback')" class="tw-flex tw-items-center tw-gap-2 tw-text-gray-500 hover:tw-text-gray-800 tw-text-sm tw-font-bold tw-px-2">
            <MessageSquare class="tw-w-4 tw-h-4" />
            {{ $t('disaster.give_feedback') }}
          </button>
        </div>
      </div>

      <div class="tw-relative tw-mt-2">
        <div class="tw-absolute -tw-top-2 tw-left-6 tw-w-4 tw-h-4 tw-bg-white tw-rotate-45"></div>
        <div class="tw-bg-white tw-rounded-2xl tw-p-4 tw-shadow-sm tw-text-[10px] tw-text-gray-500 tw-leading-relaxed">
          <p>{{ $t('disaster.tip_scroll') }}</p>
          <p>{{ $t('disaster.tip_menu') }}</p>
          <p>{{ $t('disaster.tip_toggle') }}</p>
        </div>
      </div>
    </aside>

    <!-- PC: Sidebar Toggle -->
    <div class="tw-hidden md:tw-block tw-absolute tw-top-24 tw-z-40" :class="isSidebarOpen ? 'tw-left-[310px]' : 'tw-left-6'">
      <button
        @click="isSidebarOpen = !isSidebarOpen"
        class="tw-bg-white/90 tw-backdrop-blur-md tw-p-2 tw-rounded-r-xl tw-shadow-md hover:tw-bg-white tw-text-gray-500"
      >
        <component :is="isSidebarOpen ? Minus : Plus" class="tw-w-5 tw-h-5" />
      </button>
    </div>

    <!-- ===== Map ===== -->
    <div ref="mapDiv" class="tw-w-full tw-h-full tw-bg-gray-100"></div>

    <!-- ===== Mobile: Bottom Category Sheet ===== -->
    <div class="md:tw-hidden tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-z-40">
      <div class="tw-px-4 tw-pb-3">
        <div class="tw-flex tw-gap-2 tw-overflow-x-auto tw-scrollbar-hide tw-pb-1">
          <button
            v-for="cat in categories" :key="cat.id"
            @click="toggleCategory(cat.id)"
            :class="[
              'tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2.5 tw-rounded-full tw-text-xs tw-font-bold tw-whitespace-nowrap tw-shadow-md tw-transition-all tw-flex-shrink-0',
              cat.active ? 'tw-bg-white tw-text-gray-800' : 'tw-bg-white/60 tw-backdrop-blur-sm tw-text-gray-400'
            ]"
          >
            <div class="tw-w-3 tw-h-3 tw-rounded-full" :style="{ backgroundColor: cat.color }" :class="{ 'tw-opacity-40': !cat.active }"></div>
            {{ cat.label }}
          </button>
        </div>
      </div>
      <div class="tw-h-6 tw-bg-gradient-to-t tw-from-white/80 tw-to-transparent"></div>
    </div>

    <!-- ===== Facility Detail Popup ===== -->
    <Transition name="popup">
      <div v-if="selectedFacility" class="tw-absolute tw-z-50 tw-left-4 tw-right-4 md:tw-left-auto md:tw-right-8 md:tw-w-80 tw-bottom-28 md:tw-bottom-auto md:tw-top-24 tw-bg-white tw-rounded-2xl tw-shadow-xl tw-border tw-border-gray-100 tw-overflow-hidden">
        <div class="tw-flex tw-items-center tw-gap-3 tw-p-4">
          <div class="tw-w-10 tw-h-10 tw-rounded-xl tw-flex tw-items-center tw-justify-center" :style="{ backgroundColor: getCategoryColor(selectedFacility.type) + '20' }">
            <MapPin class="tw-w-5 tw-h-5" :style="{ color: getCategoryColor(selectedFacility.type) }" />
          </div>
          <div class="tw-flex-1 tw-min-w-0">
            <h4 class="tw-font-bold tw-text-gray-800 tw-text-sm tw-truncate">{{ selectedFacility.title }}</h4>
            <p class="tw-text-[10px] tw-text-gray-400">{{ getCategoryLabel(selectedFacility.type) }}</p>
          </div>
          <button @click="selectedFacility = null" class="tw-p-1 tw-rounded-full hover:tw-bg-gray-100">
            <X class="tw-w-5 tw-h-5 tw-text-gray-400" />
          </button>
        </div>
        <div v-if="selectedFacility.range" class="tw-px-4 tw-pb-4">
          <div class="tw-bg-gray-50 tw-rounded-lg tw-p-2 tw-text-[10px] tw-text-gray-500">
            {{ $t('disaster.coverage_range') }}: {{ selectedFacility.range }}m
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== Map Controls ===== -->
    <div class="tw-absolute tw-bottom-28 md:tw-bottom-8 tw-right-4 md:tw-right-8 tw-flex tw-flex-col tw-gap-3 tw-z-40">
      <button @click="panToCurrentLocation" class="tw-bg-white tw-text-gray-600 tw-w-11 tw-h-11 md:tw-w-12 md:tw-h-12 tw-rounded-full tw-shadow-lg tw-flex tw-items-center tw-justify-center hover:tw-bg-gray-50 tw-transition-colors tw-border tw-border-gray-100">
        <Navigation class="tw-w-5 tw-h-5" />
      </button>
      <div class="tw-bg-white tw-text-gray-600 tw-rounded-full tw-shadow-lg tw-flex tw-flex-col tw-overflow-hidden tw-border tw-border-gray-100">
        <button @click="zoomIn" class="tw-w-11 tw-h-11 md:tw-w-12 md:tw-h-12 tw-flex tw-items-center tw-justify-center hover:tw-bg-gray-50 tw-border-b tw-border-gray-100">
          <Plus class="tw-w-5 tw-h-5" />
        </button>
        <button @click="zoomOut" class="tw-w-11 tw-h-11 md:tw-w-12 md:tw-h-12 tw-flex tw-items-center tw-justify-center hover:tw-bg-gray-50">
          <Minus class="tw-w-5 tw-h-5" />
        </button>
      </div>
    </div>

    <AuthModal :is-open="isLoginModalOpen" @close="isLoginModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Home, UserCircle, Search, X, MessageSquare,
  Plus, Minus, Navigation, MapPin, ChevronLeft, AlertTriangle
} from 'lucide-vue-next'

const { user, userPhotoURL } = useAuth()
const { openDrawer } = useDrawer()
const localePath = useLocalePath()
const { t, tm } = useI18n()
const { load } = useMapsLoader()

const isLoginModalOpen = ref(false)

const mapDiv = ref<HTMLElement | null>(null)
const isSidebarOpen = ref(true)
let map: google.maps.Map | null = null
let userMarker: google.maps.Marker | null = null
const markers: google.maps.Marker[] = []
const circles: google.maps.Circle[] = []

interface LocationData {
  lat: number
  lng: number
  type: string
  title: string
  range?: number
}

const selectedFacility = ref<LocationData | null>(null)

interface Category {
  id: string
  label: string
  color: string
  iconColor: string
  active: boolean
}

const categories = ref<Category[]>([
  { id: 'medical', label: t('disaster.cat_medical'), color: '#F87171', iconColor: '#F87171', active: true },
  { id: 'evac',    label: t('disaster.cat_evacuation'), color: '#4ADE80', iconColor: '#4ADE80', active: true },
  { id: 'store',   label: t('disaster.cat_grocery'), color: '#2DD4BF', iconColor: '#2DD4BF', active: false },
  { id: 'police',  label: t('disaster.cat_police'), color: '#FB923C', iconColor: '#FB923C', active: false },
  { id: 'public',  label: t('disaster.cat_public'), color: '#A78BFA', iconColor: '#A78BFA', active: true },
])

const getCategoryColor = (type: string) => categories.value.find(c => c.id === type)?.color || '#888'
const getCategoryLabel = (type: string) => categories.value.find(c => c.id === type)?.label || type

const mockLocations = ref<LocationData[]>([])

const generateMockData = (center: google.maps.LatLngLiteral) => {
  const newLocations: LocationData[] = []
  const typeList = categories.value.map(c => c.id)

  const prefixes: Record<string, string[]> = {
    medical: tm('disaster_mock.medical_prefix') as string[],
    evac: tm('disaster_mock.evac_prefix') as string[],
    store: tm('disaster_mock.store_prefix') as string[],
    police: tm('disaster_mock.police_prefix') as string[],
    public: tm('disaster_mock.public_prefix') as string[]
  }
  const suffixes: Record<string, string> = {
    medical: t('disaster_mock.medical_suffix'),
    evac: t('disaster_mock.evac_suffix'),
    store: t('disaster_mock.store_suffix'),
    police: t('disaster_mock.police_suffix'),
    public: t('disaster_mock.public_suffix')
  }

  for (let i = 0; i < 15; i++) {
    const type = typeList[Math.floor(Math.random() * typeList.length)]
    const prefix = prefixes[type][Math.floor(Math.random() * prefixes[type].length)]

    const hasRange = Math.random() > 0.7
    newLocations.push({
      lat: center.lat + (Math.random() - 0.5) * 0.015,
      lng: center.lng + (Math.random() - 0.5) * 0.015,
      type,
      title: `${prefix}${suffixes[type]}`,
      range: hasRange ? Math.floor(Math.random() * 300) + 200 : undefined
    })
  }
  mockLocations.value = newLocations
}

const initMap = async () => {
  await load()
  if (!mapDiv.value) return

  const mapStyle: google.maps.MapTypeStyle[] = [
    { featureType: "all", elementType: "labels.text.fill", stylers: [{ saturation: 36 }, { color: "#333333" }, { lightness: 40 }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ visibility: "on" }, { color: "#ffffff" }, { lightness: 16 }] },
    { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }, { lightness: 20 }] },
    { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }, { lightness: 17 }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 18 }] },
    { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 16 }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }, { lightness: 17 }] }
  ]

  const defaultPos = { lat: 35.6895, lng: 139.6917 }

  map = new google.maps.Map(mapDiv.value, {
    center: defaultPos,
    zoom: 15,
    disableDefaultUI: true,
    styles: mapStyle,
  })

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        map?.setCenter(currentPos)
        drawUserMarker(currentPos)
        generateMockData(currentPos)
        renderMarkers()
        fitMapBounds(currentPos)
      },
      () => {
        generateMockData(defaultPos)
        renderMarkers()
        fitMapBounds(defaultPos)
      },
      { enableHighAccuracy: true }
    )
  } else {
    generateMockData(defaultPos)
    renderMarkers()
  }
}

const drawUserMarker = (pos: google.maps.LatLngLiteral) => {
  if (userMarker) userMarker.setMap(null)
  const personPath = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"

  userMarker = new google.maps.Marker({
    position: pos,
    map,
    icon: { path: personPath, fillColor: '#2563EB', fillOpacity: 1, scale: 1.5, strokeColor: 'white', strokeWeight: 2, anchor: new google.maps.Point(12, 12) },
    zIndex: 999,
    title: t('disaster.current_location'),
  })

  new google.maps.Circle({
    strokeColor: "#2563EB", strokeOpacity: 0.2, strokeWeight: 1,
    fillColor: "#2563EB", fillOpacity: 0.15,
    map, center: pos, radius: 100,
  })
}

const renderMarkers = () => {
  markers.forEach(m => m.setMap(null))
  circles.forEach(c => c.setMap(null))
  markers.length = 0
  circles.length = 0

  mockLocations.value.forEach(loc => {
    const cat = categories.value.find(c => c.id === loc.type)
    if (!cat || !cat.active) return

    const marker = new google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      map,
      title: loc.title,
      icon: { path: google.maps.SymbolPath.CIRCLE, fillColor: cat.iconColor, fillOpacity: 1, scale: 7, strokeColor: 'white', strokeWeight: 2.5 },
    })
    marker.addListener('click', () => { selectedFacility.value = loc })
    markers.push(marker)

    if (loc.range) {
      circles.push(new google.maps.Circle({
        strokeColor: cat.iconColor, strokeOpacity: 0, fillColor: cat.iconColor, fillOpacity: 0.12,
        map, center: { lat: loc.lat, lng: loc.lng }, radius: loc.range,
      }))
    }
  })
}

const fitMapBounds = (center: google.maps.LatLngLiteral) => {
  if (!map || mockLocations.value.length === 0) return
  const bounds = new google.maps.LatLngBounds()
  bounds.extend(center)
  mockLocations.value.forEach(loc => bounds.extend({ lat: loc.lat, lng: loc.lng }))
  map.fitBounds(bounds)
  map.panToBounds(bounds, 50)
}

const toggleCategory = (id: string) => {
  const target = categories.value.find(c => c.id === id)
  if (target) { target.active = !target.active; renderMarkers() }
}

const zoomIn = () => { if (map) map.setZoom((map.getZoom() || 15) + 1) }
const zoomOut = () => { if (map) map.setZoom((map.getZoom() || 15) - 1) }
const panToCurrentLocation = () => {
  if (navigator.geolocation && map) {
    navigator.geolocation.getCurrentPosition((pos) => {
      map?.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      map?.setZoom(16)
    })
  }
}

onMounted(() => { initMap() })

useHead(() => ({ title: t('disaster.title') }))
</script>

<style scoped>
.tw-scrollbar-hide::-webkit-scrollbar { display: none; }
.tw-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.popup-enter-active, .popup-leave-active { transition: all 0.25s ease; }
.popup-enter-from, .popup-leave-to { opacity: 0; transform: translateY(12px); }
</style>
