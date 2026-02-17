<template>
  <div class="tw-relative tw-w-full tw-h-screen tw-overflow-hidden tw-font-sans">
    
    <header class="tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-h-16 tw-bg-white/90 tw-backdrop-blur-md tw-shadow-sm tw-z-50 tw-flex tw-items-center tw-justify-between tw-px-6">
      <div class="tw-flex tw-items-center tw-gap-4">
        <div class="tw-w-8 tw-h-8 tw-rounded-full tw-bg-gradient-to-br tw-from-[#FFD700] tw-via-[#FF6B6B] tw-to-[#4ECDC4] tw-flex tw-items-center tw-justify-center tw-shadow-inner">
          <div class="tw-w-full tw-h-full tw-bg-white tw-bg-opacity-20 tw-rounded-full"></div>
        </div>
        <div class="tw-flex tw-items-baseline tw-gap-3">
          <h1 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-tracking-wide">防災マップ</h1>
          <span class="tw-text-xs tw-text-gray-500 tw-font-medium">ソナエアレバ...</span>
        </div>
      </div>

      <div class="tw-flex tw-items-center tw-gap-6">
        <button class="tw-group tw-flex tw-items-center tw-justify-center hover:tw-opacity-70 tw-transition-opacity">
          <FileText class="tw-w-6 tw-h-6 tw-text-gray-400 group-hover:tw-text-[#85C441]" />
        </button>
        <button class="tw-group tw-flex tw-items-center tw-justify-center hover:tw-opacity-70 tw-transition-opacity" @click="$router.push(localePath('/'))">
          <Home class="tw-w-6 tw-h-6 tw-text-gray-400 group-hover:tw-text-[#85C441]" />
        </button>
        <div class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer hover:tw-opacity-80">
          <div v-if="userPhotoURL">
             <img :src="userPhotoURL" class="tw-w-9 tw-h-9 tw-rounded-full tw-border tw-border-gray-200" />
          </div>
          <UserCircle v-else class="tw-w-9 tw-h-9 tw-text-gray-400" />
          <span class="tw-text-sm tw-font-bold tw-text-gray-600">{{ userDisplayName || 'Guest' }}</span>
        </div>
      </div>
    </header>

    <aside 
      class="tw-absolute tw-top-24 tw-left-6 tw-w-72 tw-flex tw-flex-col tw-gap-4 tw-z-40 tw-transition-transform tw-duration-300"
      :class="isSidebarOpen ? 'tw-translate-x-0' : '-tw-translate-x-[110%]'"
    >
      <div class="tw-bg-white/80 tw-backdrop-blur-md tw-rounded-2xl tw-p-2 tw-shadow-lg tw-border tw-border-white/50">
        <div class="tw-relative">
          <input 
            type="text" 
            placeholder="施設を検索..." 
            class="tw-w-full tw-bg-white tw-rounded-xl tw-py-2 tw-pl-10 tw-pr-8 tw-text-sm tw-outline-none focus:tw-ring-2 focus:tw-ring-[#85C441]/50 tw-text-gray-700"
          />
          <Search class="tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-w-4 tw-h-4 tw-text-gray-400" />
          <X class="tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-w-4 tw-h-4 tw-text-gray-300 tw-cursor-pointer hover:tw-text-gray-500" />
        </div>
      </div>

      <div class="tw-bg-white/80 tw-backdrop-blur-md tw-rounded-3xl tw-p-4 tw-shadow-lg tw-border tw-border-white/50 tw-space-y-2">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          @click="toggleCategory(cat.id)"
          class="tw-w-full tw-flex tw-items-center tw-gap-3 tw-p-3 tw-rounded-xl tw-transition-all hover:tw-bg-white/60"
          :class="{'tw-bg-white tw-shadow-sm': cat.active, 'tw-opacity-60': !cat.active}"
        >
          <div 
            class="tw-w-4 tw-h-4 tw-rounded-full tw-shadow-sm" 
            :style="{ backgroundColor: cat.color }"
          ></div>
          <span class="tw-text-sm tw-font-bold tw-text-gray-600">{{ cat.label }}</span>
          <div v-if="cat.active" class="tw-ml-auto tw-w-2 tw-h-2 tw-rounded-full tw-bg-gray-400"></div>
        </button>

        <div class="tw-pt-4 tw-mt-4 tw-border-t tw-border-gray-200/50">
           <button class="tw-flex tw-items-center tw-gap-2 tw-text-gray-500 hover:tw-text-gray-800 tw-text-sm tw-font-bold tw-px-2">
             <MessageSquare class="tw-w-4 tw-h-4" />
             フィードバック
           </button>
        </div>
      </div>
      
      <div class="tw-relative tw-mt-2">
         <div class="tw-absolute -tw-top-2 tw-left-6 tw-w-4 tw-h-4 tw-bg-white tw-rotate-45"></div>
         <div class="tw-bg-white tw-rounded-2xl tw-p-4 tw-shadow-sm tw-text-[10px] tw-text-gray-500 tw-leading-relaxed">
            <p>● 地図はスクロールで移動</p>
            <p>● メニューセレクトは表示切替</p>
            <p>● メニューは「＋」「－」で出し入れ</p>
         </div>
      </div>
    </aside>

    <div class="tw-absolute tw-top-24 tw-left-6 tw-z-40" v-if="!isSidebarOpen">
       <button 
         @click="isSidebarOpen = true"
         class="tw-bg-white/90 tw-backdrop-blur-md tw-p-2 tw-rounded-r-xl tw-shadow-md hover:tw-bg-white tw-text-gray-500"
       >
         <Plus class="tw-w-5 tw-h-5" />
       </button>
    </div>
    <div class="tw-absolute tw-top-24 tw-left-[310px] tw-z-40" v-if="isSidebarOpen">
       <button 
         @click="isSidebarOpen = false"
         class="tw-bg-white/80 tw-backdrop-blur-md tw-w-6 tw-h-8 tw-rounded-r-md tw-shadow-sm hover:tw-bg-white tw-text-gray-400 tw-flex tw-items-center tw-justify-center"
       >
         <Minus class="tw-w-4 tw-h-4" />
       </button>
    </div>


    <div ref="mapDiv" class="tw-w-full tw-h-full tw-bg-gray-100"></div>


    <div class="tw-absolute tw-bottom-8 tw-right-8 tw-flex tw-flex-col tw-gap-3 tw-z-40">
      
      <button 
        @click="panToCurrentLocation"
        class="tw-bg-gray-700/80 tw-backdrop-blur-sm tw-text-white tw-w-12 tw-h-12 tw-rounded-full tw-shadow-lg tw-flex tw-items-center tw-justify-center hover:tw-bg-gray-600 tw-transition-colors"
      >
        <Navigation class="tw-w-5 tw-h-5" />
      </button>

      <div class="tw-bg-gray-700/80 tw-backdrop-blur-sm tw-text-white tw-rounded-full tw-shadow-lg tw-flex tw-flex-col tw-overflow-hidden">
        <button 
          @click="zoomIn"
          class="tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center hover:tw-bg-gray-600 tw-border-b tw-border-gray-500"
        >
          <Plus class="tw-w-6 tw-h-6" />
        </button>
        <button 
          @click="zoomOut"
          class="tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center hover:tw-bg-gray-600"
        >
          <Minus class="tw-w-6 tw-h-6" />
        </button>
      </div>

      <div class="tw-absolute tw-right-16 tw-bottom-2 tw-pointer-events-none">
         <div class="tw-flex tw-flex-col tw-items-end">
            <div class="tw-border-b-2 tw-border-l-2 tw-border-r-2 tw-border-gray-600 tw-h-2 tw-w-16"></div>
            <span class="tw-text-[10px] tw-font-bold tw-text-gray-600">200m</span>
         </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Home, FileText, UserCircle, Search, X, MessageSquare, 
  Plus, Minus, Navigation 
} from 'lucide-vue-next'

// --- Auth & Utils ---
const { userDisplayName, userPhotoURL } = useAuth()
const localePath = useLocalePath()
const { load } = useMapsLoader()

// --- State ---
const mapDiv = ref<HTMLElement | null>(null)
const isSidebarOpen = ref(true)
let map: google.maps.Map | null = null
let userMarker: google.maps.Marker | null = null
const markers: google.maps.Marker[] = []
const circles: google.maps.Circle[] = []

// --- Categories Config ---
interface Category {
  id: string
  label: string
  color: string // Hex for UI
  iconColor: string // Google Maps Marker Color
  active: boolean
}

const categories = ref<Category[]>([
  { id: 'medical', label: '医療サービス', color: '#F87171', iconColor: '#F87171', active: true },
  { id: 'evac',    label: '避難エリア',   color: '#4ADE80', iconColor: '#4ADE80', active: true },
  { id: 'store',   label: '食料品・ドラッグストア', color: '#2DD4BF', iconColor: '#2DD4BF', active: false },
  { id: 'police',  label: '警察・消防',   color: '#FB923C', iconColor: '#FB923C', active: false },
  { id: 'public',  label: '公共施設',     color: '#A78BFA', iconColor: '#A78BFA', active: true },
])

// --- Mock Data Handling ---
interface LocationData {
  lat: number
  lng: number
  type: string
  title: string
  range?: number
}

const mockLocations = ref<LocationData[]>([])

// 現在地周辺にランダムデータを生成する関数
const generateMockData = (center: google.maps.LatLngLiteral) => {
  const newLocations: LocationData[] = []
  const count = 15 // 生成する数
  const range = 0.015 // 散らばり具合（約1.5km程度）

  const typeList = categories.value.map(c => c.id)
  
  // 施設名のプレフィックス（それっぽく見せるため）
  const prefixes: Record<string, string[]> = {
    medical: ['中央', '駅前', '市民', 'さくら', 'こども'],
    evac: ['第一', '中央', '南', '北', '公園'],
    store: ['マート', 'ストア', '市場', 'ショップ'],
    police: ['駅前', '中央', '北', '南'],
    public: ['センター', '会館', '役所', '図書館']
  }
  const suffixes: Record<string, string> = {
    medical: 'クリニック',
    evac: '避難所',
    store: '商店',
    police: '交番',
    public: '公民館'
  }

  for (let i = 0; i < count; i++) {
    const type = typeList[Math.floor(Math.random() * typeList.length)]
    const prefix = prefixes[type][Math.floor(Math.random() * prefixes[type].length)]
    const suffix = suffixes[type]
    
    // 現在地からのランダムなオフセット
    const latOffset = (Math.random() - 0.5) * range
    const lngOffset = (Math.random() - 0.5) * range

    // 一部のデータには範囲円用のrangeを持たせる
    const hasRange = Math.random() > 0.7
    const rangeVal = hasRange ? Math.floor(Math.random() * 300) + 200 : undefined

    newLocations.push({
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset,
      type: type,
      title: `${prefix}${suffix}`,
      range: rangeVal
    })
  }
  mockLocations.value = newLocations
}

// --- Map Logic ---

const initMap = async () => {
  await load()
  
  if (!mapDiv.value) return

  // マップスタイル
  const mapStyle: google.maps.MapTypeStyle[] = [
    { featureType: "all", elementType: "labels.text.fill", stylers: [{ saturation: 36 }, { color: "#333333" }, { lightness: 40 }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ visibility: "on" }, { color: "#ffffff" }, { lightness: 16 }] },
    { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "administrative", elementType: "geometry.fill", stylers: [{ color: "#fefefe" }, { lightness: 20 }] },
    { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }, { lightness: 20 }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f5f5f5" }, { lightness: 21 }] },
    { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }, { lightness: 17 }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 18 }] },
    { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#ffffff" }, { lightness: 16 }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#f2f2f2" }, { lightness: 19 }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }, { lightness: 17 }] }
  ]

  // 初期位置（仮）
  const defaultPos = { lat: 35.6895, lng: 139.6917 }

  map = new google.maps.Map(mapDiv.value, {
    center: defaultPos,
    zoom: 15,
    disableDefaultUI: true, // デフォルトUIを隠す
    styles: mapStyle,
  })

  // 現在地取得とデータ生成
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        
        // 1. マップ中心移動
        map?.setCenter(currentPos)
        
        // 2. ユーザーマーカー表示
        drawUserMarker(currentPos)
        
        // 3. 現在地周辺にダミーデータを生成
        generateMockData(currentPos)
        
        // 4. 生成したデータを描画し、全マーカーが収まるように調整
        renderMarkers()
        fitMapBounds(currentPos)
      },
      () => {
        console.warn('Geolocation failed. Using default location.')
        // 取得失敗時はデフォルト位置で生成
        generateMockData(defaultPos)
        renderMarkers()
        fitMapBounds(defaultPos)
      },
      { enableHighAccuracy: true }
    )
  } else {
    // Geolocation非対応時
    generateMockData(defaultPos)
    renderMarkers()
  }
}

// ★修正: ユーザーの現在地マーカー（人型アイコン）
const drawUserMarker = (pos: google.maps.LatLngLiteral) => {
  if (userMarker) userMarker.setMap(null)
  
  // 人型アイコンのSVGパス (Material Design Person Icon Shape)
  const personPath = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z";

  const svgIcon = {
    path: personPath,
    fillColor: '#2563EB', // 視認性の高い青
    fillOpacity: 1,
    scale: 1.5,
    strokeColor: 'white',
    strokeWeight: 2,
    anchor: new google.maps.Point(12, 12),
  }

  userMarker = new google.maps.Marker({
    position: pos,
    map: map,
    icon: svgIcon,
    zIndex: 999, // 最前面に表示
    title: "現在地",
  })

  // 簡易的なパルス表現（固定の半透明円）
  new google.maps.Circle({
    strokeColor: "#2563EB",
    strokeOpacity: 0.2,
    strokeWeight: 1,
    fillColor: "#2563EB",
    fillOpacity: 0.2,
    map: map,
    center: pos,
    radius: 100, 
  })
}

// 施設マーカーの描画
const renderMarkers = () => {
  // 既存マーカー削除
  markers.forEach(m => m.setMap(null))
  circles.forEach(c => c.setMap(null))
  markers.length = 0
  circles.length = 0

  mockLocations.value.forEach(loc => {
    const cat = categories.value.find(c => c.id === loc.type)
    if (!cat || !cat.active) return

    // マーカー
    const marker = new google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      map: map,
      title: loc.title,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: cat.iconColor,
        fillOpacity: 1,
        scale: 6,
        strokeColor: 'white',
        strokeWeight: 2,
      },
    })
    markers.push(marker)

    // 範囲円（特定の条件で描画）
    if (loc.range) {
       const circle = new google.maps.Circle({
        strokeColor: cat.iconColor,
        strokeOpacity: 0.0,
        strokeWeight: 0,
        fillColor: cat.iconColor,
        fillOpacity: 0.15,
        map: map,
        center: { lat: loc.lat, lng: loc.lng },
        radius: loc.range,
      })
      circles.push(circle)
    }
  })
}

// 全てのマーカーが収まるように表示範囲を調整
const fitMapBounds = (center: google.maps.LatLngLiteral) => {
  if (!map || mockLocations.value.length === 0) return

  const bounds = new google.maps.LatLngBounds()
  bounds.extend(center) // 現在地を含める

  mockLocations.value.forEach(loc => {
    bounds.extend({ lat: loc.lat, lng: loc.lng })
  })

  map.fitBounds(bounds)
  map.panToBounds(bounds, 50) // マージン調整
}

// カテゴリ切り替え
const toggleCategory = (id: string) => {
  const target = categories.value.find(c => c.id === id)
  if (target) {
    target.active = !target.active
    renderMarkers() 
  }
}

// マップ操作
const zoomIn = () => {
  if (map) map.setZoom((map.getZoom() || 15) + 1)
}
const zoomOut = () => {
  if (map) map.setZoom((map.getZoom() || 15) - 1)
}
const panToCurrentLocation = () => {
  if (navigator.geolocation && map) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      map?.panTo(p)
      map?.setZoom(16)
    })
  }
}

onMounted(() => {
  initMap()
})
</script>

<style scoped>
/* スクロールバー非表示など必要であれば */
</style>