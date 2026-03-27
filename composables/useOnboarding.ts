export interface OnboardingStep {
  id: string
  target: string
  titleKey: string
  descKey: string
}

const STORAGE_PREFIX = 'ru-mana-onboarding-'

export const useOnboarding = () => {
  const isActive = useState<boolean>('onboarding-active', () => false)
  const currentStepIndex = useState<number>('onboarding-step-index', () => 0)
  const currentPageId = useState<string>('onboarding-page-id', () => '')
  const currentSteps = useState<OnboardingStep[]>('onboarding-steps', () => [])

  const totalSteps = computed(() => currentSteps.value.length)
  const currentStep = computed(() => currentSteps.value[currentStepIndex.value] || null)
  const isLastStep = computed(() => currentStepIndex.value >= totalSteps.value - 1)
  const isFirstStep = computed(() => currentStepIndex.value === 0)

  const isCompleted = (pageId: string): boolean => {
    try {
      return localStorage.getItem(STORAGE_PREFIX + pageId) === 'done'
    } catch {
      return false
    }
  }

  const markCompleted = (pageId: string) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + pageId, 'done')
    } catch {}
  }

  const start = (pageId: string, steps: OnboardingStep[]) => {
    if (steps.length === 0) return
    currentPageId.value = pageId
    currentSteps.value = steps
    currentStepIndex.value = 0
    isActive.value = true
  }

  const next = () => {
    if (isLastStep.value) {
      finish()
    } else {
      currentStepIndex.value++
    }
  }

  const prev = () => {
    if (!isFirstStep.value) {
      currentStepIndex.value--
    }
  }

  const skip = () => {
    isActive.value = false
    currentSteps.value = []
    currentStepIndex.value = 0
  }

  const finish = () => {
    markCompleted(currentPageId.value)
    isActive.value = false
    currentSteps.value = []
    currentStepIndex.value = 0
  }

  return {
    isActive,
    currentStepIndex,
    currentStep,
    totalSteps,
    isLastStep,
    isFirstStep,
    currentPageId,
    currentSteps,
    isCompleted,
    start,
    next,
    prev,
    skip,
    finish
  }
}
