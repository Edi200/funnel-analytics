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
  <div class="mt-4 rounded-xl border border-[#CECBF6] bg-white p-5">
    <h2 class="mb-3 font-[family-name:var(--font-heading)] text-base font-semibold text-[#26215C]">
      Insights
    </h2>

    <ul v-if="insights.length > 0">
      <li
        v-for="(insight, index) in insights"
        :key="index"
        class="mb-3 border-l-2 border-[#7F77DD] pl-3 text-sm leading-relaxed text-[#5F5E5A]"
        :class="{ 'mb-0': index === insights.length - 1 }"
      >
        {{ insight }}
      </li>
    </ul>

    <p v-else class="text-sm text-[#888780]">
      No significant issues detected.
    </p>
  </div>
</template>
