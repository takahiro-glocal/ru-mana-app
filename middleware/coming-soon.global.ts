export default defineNuxtRouteMiddleware((to) => {
  const comingSoonPages = ['/miru', '/kiku', '/iku']
  const localePath = useLocalePath()

  const matched = comingSoonPages.find((page) => {
    const resolved = localePath(page)
    return to.path === resolved || to.path === resolved + '/'
  })

  if (matched) {
    const pageName = matched.replace('/', '') // 'miru', 'kiku', 'iku'
    return navigateTo({
      path: localePath('/'),
      query: { coming_soon: pageName },
    })
  }
})
