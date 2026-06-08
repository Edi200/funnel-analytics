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

const engageRate = computed(() =>
  props.step.views > 0
    ? Math.round((props.step.proceeds / props.step.views) * 100)
    : 0,
)

const isGoodEngage = computed(() => engageRate.value >= 20)
</script>

<template>
  <article
    class="flex items-center gap-4 rounded-xl p-4"
    :class="
      isWorst
        ? 'border-2 border-[#E24B4A] bg-white'
        : 'border border-[#CECBF6] bg-white'
    "
  >
    <span
      class="min-w-[48px] font-[family-name:var(--font-heading)] text-6xl leading-none font-bold"
      :class="isWorst ? 'text-[#E24B4A]' : 'text-[#EEEDFE]'"
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
          v-if="isWorst && !isFirst"
          class="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#BA7517] bg-[#FAEEDA] px-2 py-0.5 text-xs font-medium text-[#633806]"
        >
          <span
            class="inline-flex h-4 w-4 text-[#BA7517] [&_svg]:h-full [&_svg]:w-full"
            v-html="warningIcon"
          />
          Biggest drop-off
        </span>
      </div>

      <p
        class="mb-2 text-xs text-[#888780]"
      >
        {{ formattedViews }} views · {{ formattedProceeds }} proceeded
      </p>

      <p
        v-if="isFirst"
        class="mb-1 text-xs font-medium"
        :class="isGoodEngage ? 'text-[#3B6D11]' : 'text-[#E24B4A]'"
      >
        {{ isGoodEngage ? '▲' : '▼' }} {{ engageRate }}% engaged
      </p>
      <p
        v-else
        class="mb-1 text-xs font-medium text-[#E24B4A]"
      >
        ▼ {{ step.dropOffRate }}% drop-off
      </p>

      <div
        class="h-1.5 w-full rounded"
        :class="isWorst ? 'bg-[#FCEBEB]' : 'bg-[#EEEDFE]'"
      >
        <div
          class="h-1.5 rounded"
          :class="isWorst ? 'bg-[#E24B4A]' : 'bg-[#7F77DD]'"
          :style="{ width: `${barWidthPercent}%` }"
        />
      </div>
    </div>
  </article>
</template>
