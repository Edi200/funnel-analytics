import { computed } from 'vue'
import type { Campaign, StepWithMetrics } from '@/types'

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

function computeDropOffRate(views: number, proceeds: number): number {
  if (views === 0) {
    return 0
  }

  return roundToOneDecimal(((views - proceeds) / views) * 100)
}

export function useFunnelMetrics(campaign: Campaign) {
  const stepsWithMetrics = computed<StepWithMetrics[]>(() =>
    campaign.steps.map((step) => ({
      ...step,
      dropOffRate: computeDropOffRate(step.views, step.proceeds),
    })),
  )

  const worstStepIndex = computed(() => {
    const steps = stepsWithMetrics.value

    if (steps.length === 0) {
      return -1
    }

    let worstIdx = 0
    let maxDropOff = steps[0]!.dropOffRate

    for (let i = 1; i < steps.length; i++) {
      const step = steps[i]
      if (step && step.dropOffRate > maxDropOff) {
        maxDropOff = step.dropOffRate
        worstIdx = i
      }
    }

    return worstIdx
  })

  const worstStep = computed(() => {
    const idx = worstStepIndex.value

    if (idx < 0) {
      return undefined
    }

    return stepsWithMetrics.value[idx]
  })

  return { stepsWithMetrics, worstStep, worstStepIndex }
}
