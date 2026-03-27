export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.openWeatherApiKey as string

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Weather API key not configured' })
  }

  const query = getQuery(event)
  const { lat, lon, lang } = query

  if (!lat || !lon) {
    throw createError({ statusCode: 400, statusMessage: 'lat and lon are required' })
  }

  // 座標の範囲チェック
  const latNum = Number(lat)
  const lonNum = Number(lon)
  if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid coordinates' })
  }

  try {
    const data = await $fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latNum}&lon=${lonNum}&units=metric&lang=${lang || 'ja'}&appid=${apiKey}`
    )
    return data
  } catch (e: any) {
    console.error('Weather API error:', e.message)
    throw createError({ statusCode: 502, statusMessage: 'Weather service unavailable' })
  }
})
