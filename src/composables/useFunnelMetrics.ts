import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { Step, StepWithMetrics } from '@/types'

interface CampaignForMetrics {
  steps: ReadonlyArray<Step>
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

function computeDropOffRate(views: number, proceeds: number): number {
  if (views === 0) {
    return 0
  }

  return roundToOneDecimal(((views - proceeds) / views) * 100)
}

export function useFunnelMetrics(campaign: MaybeRefOrGetter<CampaignForMetrics>) {
  const stepsWithMetrics = computed<StepWithMetrics[]>(() =>
    toValue(campaign).steps.map((step) => ({
      ...step,
      dropOffRate: computeDropOffRate(step.views, step.proceeds),
    })),
  )

  const worstStepIndex = computed(() => {
    const steps = stepsWithMetrics.value

    if (steps.length <= 1) {
      return -1
    }

    let worstIdx = 1
    let maxDropOff = steps[1]!.dropOffRate

    for (let i = 2; i < steps.length; i++) {
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
