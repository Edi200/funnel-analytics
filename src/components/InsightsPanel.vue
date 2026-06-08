<script setup lang="ts">
import { computed } from 'vue'
import type { StepWithMetrics } from '@/types'

interface Props {
  stepsWithMetrics: StepWithMetrics[]
  worstStep: StepWithMetrics | undefined
  overallConversionRate: number
}

const props = defineProps<Props>()

const isWorstSignificant = computed(() => {
  if (!props.worstStep) {
    return false
  }

  const isLast =
    props.stepsWithMetrics[props.stepsWithMetrics.length - 1]?.id ===
    props.worstStep.id

  return isLast
    ? props.worstStep.dropOffRate >= 5
    : props.worstStep.dropOffRate >= 10
})

const insights = computed(() => {
  if (props.stepsWithMetrics.length === 0) {
    return []
  }

  const list: string[] = []

  if (props.worstStep) {
    if (isWorstSignificant.value) {
      if (props.worstStep.type === 'email') {
        list.push(
          `Biggest drop-off is at ${props.worstStep.name} (${props.worstStep.dropOffRate}%). The email form may be too complex — consider reducing the number of fields.`,
        )
      } else {
        list.push(
          `Biggest drop-off is at ${props.worstStep.name} (${props.worstStep.dropOffRate}%). Focus optimization here first.`,
        )
      }
    } else {
      list.push(
        `This campaign is performing well. The highest drop-off is only ${props.worstStep.dropOffRate}% at ${props.worstStep.name} — minor fine-tuning could push it even further.`,
      )
    }
  }

  if (props.worstStep) {
    const criticalSteps = props.stepsWithMetrics.filter(
      (s) => s.dropOffRate >= 60 && s.id !== props.worstStep!.id,
    )
    for (const step of criticalSteps) {
      if (list.length >= 3) {
        break
      }
      if (step.type === 'email') {
        list.push(
          `${step.name} also has critically high drop-off (${step.dropOffRate}%). Consider reducing the number of fields.`,
        )
      } else {
        list.push(
          `${step.name} also has critically high drop-off (${step.dropOffRate}%). Review this step as well.`,
        )
      }
    }
  }

  if (list.length < 3 && props.overallConversionRate < 5) {
    list.push(
      'Overall conversion is below 5%. Consider A/B testing your campaign.',
    )
  }

  return list.slice(0, 3)
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
