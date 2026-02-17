type DrawerStep = 'menu' | 'profile' | 'history' | 'general' | 'points' | 'feedback'

export const useDrawer = () => {
  const isDrawerOpen = useState<boolean>('global-drawer-open', () => false)
  const currentStep = useState<DrawerStep>('global-drawer-step', () => 'menu')

  const openDrawer = (step: DrawerStep = 'menu') => {
    currentStep.value = step
    isDrawerOpen.value = true
  }

  const closeDrawer = () => {
    isDrawerOpen.value = false
  }

  return {
    isDrawerOpen,
    currentStep,
    openDrawer,
    closeDrawer
  }
}