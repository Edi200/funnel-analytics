<script setup lang="ts">
import { computed } from 'vue'
import type { Campaign, Step, StepWithMetrics } from '@/types'

interface Props {
  campaign: Readonly<Omit<Campaign, 'steps'>> & {
    steps: ReadonlyArray<Readonly<Step>>
  }
  stepsWithMetrics: StepWithMetrics[]
  worstStep: StepWithMetrics | undefined
  overallConversionRate: number
}

const props = defineProps<Props>()

const insights = computed(() => {
  const results: string[] = []

  if (props.worstStep) {
    if (props.worstStep.type === 'email') {
      results.push(
        `Biggest drop-off is at ${props.worstStep.name} (${props.worstStep.dropOffRate}%). The email form may be too complex — consider reducing the number of fields.`,
      )
    } else {
      results.push(
        `Biggest drop-off is at ${props.worstStep.name} (${props.worstStep.dropOffRate}%). Focus optimization here first.`,
      )
    }
  }

  const firstStep = props.stepsWithMetrics[0]
  if (firstStep && firstStep.dropOffRate > 80) {
    results.push(
      "Most visitors didn't engage with the first step. Consider improving the offer or timing.",
    )
  }

  if (props.overallConversionRate < 5) {
    results.push(
      'Overall conversion is below 5%. Consider A/B testing your campaign.',
    )
  }

  return results.slice(0, 3)
})
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-5">
    <h2 class="font-semibold text-gray-900">Insights</h2>

    <ul v-if="insights.length > 0" class="mt-3 space-y-3">
      <li
        v-for="(insight, index) in insights"
        :key="index"
        class="border-l-2 border-blue-400 pl-3 text-sm text-gray-700"
      >
        {{ insight }}
      </li>
    </ul>

    <p v-else class="mt-2 text-sm text-gray-500">
      No significant issues detected.
    </p>
  </div>
</template>
