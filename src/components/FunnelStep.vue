<script setup lang="ts">
import { computed } from 'vue'
import warningIcon from '@/assets/icons/warning.svg?raw'
import type { StepWithMetrics } from '@/types'

interface Props {
  step: StepWithMetrics
  stepNumber: number
  isWorst: boolean
  isFirst: boolean
  totalViews: number
}

const props = defineProps<Props>()

const barWidthPercent = computed(() =>
  props.totalViews > 0 ? (props.step.views / props.totalViews) * 100 : 0,
)

const formattedViews = computed(() => props.step.views.toLocaleString())

const formattedProceeds = computed(() => props.step.proceeds.toLocaleString())
</script>

<template>
  <article
    class="rounded-lg p-4"
    :class="
      isWorst
        ? 'border-2 border-orange-400 bg-orange-50'
        : 'border border-gray-200 bg-white'
    "
  >
    <p class="text-xs tracking-wide text-gray-400 uppercase">
      Step {{ stepNumber }}
    </p>

    <p
      v-if="isFirst"
      class="mt-2 text-sm font-medium text-red-600"
    >
      ▼ {{ step.dropOffRate }}% didn't engage
    </p>
    <p
      v-else
      class="mt-2 text-sm font-medium text-red-600"
    >
      ▼ {{ step.dropOffRate }}% drop-off
    </p>

    <div
      class="flex items-start justify-between gap-3"
      :class="isFirst ? 'mt-2' : 'mt-1'"
    >
      <h3 class="font-semibold text-gray-900">{{ step.name }}</h3>
      <span
        v-if="isWorst && !isFirst"
        class="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700"
      >
        <span
          class="inline-flex h-4 w-4 text-yellow-500 [&_svg]:h-full [&_svg]:w-full"
          v-html="warningIcon"
        />
        Biggest drop-off
      </span>
    </div>

    <p class="mt-1 text-sm text-gray-600">
      {{ formattedViews }} views · {{ formattedProceeds }} proceeded
    </p>

    <div class="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        class="h-full rounded-full transition-all"
        :class="isWorst ? 'bg-orange-500' : 'bg-blue-500'"
        :style="{ width: `${barWidthPercent}%` }"
      />
    </div>
  </article>
</template>
