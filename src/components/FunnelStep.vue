<script setup lang="ts">
import { computed } from 'vue'
import warningIcon from '@/assets/icons/warning.svg?raw'
import type { StepWithMetrics } from '@/types'

interface Props {
  step: StepWithMetrics
  stepNumber: number
  isWorst: boolean
  isCritical: boolean
  isLast: boolean
  totalViews: number
}

const props = defineProps<Props>()

const proceedsPercent = computed(() => {
  if (props.totalViews === 0) {
    return 0
  }

  const raw = (props.step.proceeds / props.totalViews) * 100
  return Math.min(100, raw)
})

const dropOffPercent = computed(() => {
  if (props.totalViews === 0) {
    return 0
  }

  const raw = ((props.step.views - props.step.proceeds) / props.totalViews) * 100
  return Math.min(100, raw)
})

const barFillClass = computed(() => {
  if (showWorstHighlight.value) {
    return 'bg-[#E24B4A]'
  }

  if (showCriticalHighlight.value) {
    return 'bg-[#EF9F27]'
  }

  return 'bg-[#7F77DD]'
})

const formattedViews = computed(() => props.step.views.toLocaleString())

const formattedProceeds = computed(() => props.step.proceeds.toLocaleString())

const dropOffThreshold = computed(() => (props.isLast ? 5 : 10))

const completionRate = computed(() =>
  Math.round((100 - props.step.dropOffRate) * 10) / 10,
)

const isLabelPositive = computed(() => {
  if (showWorstHighlight.value) {
    return false
  }

  return props.step.dropOffRate < dropOffThreshold.value
})

const stepLabel = computed(() => {
  if (isLabelPositive.value) {
    return `▲ ${completionRate.value}% completion rate`
  }

  return `▼ ${props.step.dropOffRate}% drop-off`
})

const showWorstHighlight = computed(() => {
  if (!props.isWorst) {
    return false
  }

  if (props.isLast) {
    return props.step.dropOffRate >= 5
  }

  return props.step.dropOffRate >= 10
})

const showCriticalHighlight = computed(
  () => props.isCritical && !props.isWorst,
)
</script>

<template>
  <article
    class="flex items-center gap-4 rounded-xl bg-white p-4"
    :class="
      showWorstHighlight
        ? 'border-2 border-[#E24B4A]'
        : showCriticalHighlight
          ? 'border-2 border-[#EF9F27]'
          : 'border border-[#CECBF6]'
    "
  >
    <span
      class="min-w-[48px] font-[family-name:var(--font-heading)] text-6xl leading-none font-bold"
      :class="
        showWorstHighlight
          ? 'text-[#E24B4A]'
          : showCriticalHighlight
            ? 'text-[#EF9F27]'
            : 'text-[#EEEDFE]'
      "
    >
      {{ stepNumber }}
    </span>

    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-2">
        <h3
          class="font-[family-name:var(--font-heading)] text-sm font-semibold text-[#26215C]"
        >
          {{ step.name }}
        </h3>
        <span
          v-if="showWorstHighlight"
          class="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#E24B4A] bg-[#FCEBEB] px-2 py-0.5 text-xs font-medium text-[#A32D2D]"
        >
          <span
            class="inline-flex h-4 w-4 text-[#E24B4A] [&_svg]:h-full [&_svg]:w-full"
            v-html="warningIcon"
          />
          Biggest drop-off
        </span>
        <span
          v-else-if="showCriticalHighlight"
          class="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#EF9F27] bg-[#FAEEDA] px-2 py-0.5 text-xs font-medium text-[#633806]"
        >
          <span
            class="inline-flex h-4 w-4 text-[#EF9F27] [&_svg]:h-full [&_svg]:w-full"
            v-html="warningIcon"
          />
          High drop-off
        </span>
      </div>

      <p
        class="mb-2 text-xs text-[#888780]"
      >
        {{ formattedViews }} views · {{ formattedProceeds }} proceeded
      </p>

      <p
        class="mb-1 text-xs font-medium"
        :class="isLabelPositive ? 'text-[#3B6D11]' : 'text-[#E24B4A]'"
      >
        {{ stepLabel }}
      </p>

      <div
        class="h-1.5 w-full rounded"
        :class="
          showWorstHighlight
            ? 'bg-[#FCEBEB]'
            : showCriticalHighlight
              ? 'bg-[#FAEEDA]'
              : 'bg-[#EEEDFE]'
        "
      >
        <div class="flex h-1.5">
          <div
            class="h-1.5 rounded-l"
            :class="barFillClass"
            :style="{ width: `${proceedsPercent}%` }"
          />
          <div
            class="h-1.5 bg-[#D3D1C7]"
            :class="isLast ? 'rounded-r' : ''"
            :style="{ width: `${dropOffPercent}%` }"
          />
        </div>
      </div>
    </div>
  </article>
</template>
