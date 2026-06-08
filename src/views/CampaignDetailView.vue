<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DesktopIcon from '@/assets/icons/desktop.svg?raw'
import MobileIcon from '@/assets/icons/mobile.svg?raw'
import FunnelStep from '@/components/FunnelStep.vue'
import { useCampaigns } from '@/composables/useCampaigns'
import { useFunnelMetrics } from '@/composables/useFunnelMetrics'
import type { Campaign } from '@/types'

const route = useRoute()
const router = useRouter()
const { campaigns, getOverallConversionRate } = useCampaigns()

const EMPTY_CAMPAIGN: Campaign = {
  id: '',
  name: '',
  device: 'desktop',
  steps: [],
}

const campaignId = computed(() => String(route.params.id))

const campaign = computed(() =>
  campaigns.value.find((c) => c.id === campaignId.value),
)

const isNotFound = computed(() => !campaign.value)

const { stepsWithMetrics, worstStepIndex } = useFunnelMetrics(
  () => campaign.value ?? EMPTY_CAMPAIGN,
)

const conversionRate = computed(() =>
  campaign.value ? getOverallConversionRate(campaign.value) : 0,
)

const totalViews = computed(() => campaign.value?.steps[0]?.views ?? 0)

const deviceInfo = computed(() => {
  if (campaign.value?.device === 'mobile') {
    return { icon: MobileIcon, label: 'Mobile' }
  }

  return { icon: DesktopIcon, label: 'Desktop' }
})

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <button
      type="button"
      class="mb-6 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      @click="goBack"
    >
      ← Back
    </button>

    <div v-if="isNotFound">
      <h1 class="text-2xl font-bold text-gray-900">Campaign not found</h1>
      <p class="mt-2 text-gray-600">
        The campaign you're looking for doesn't exist.
      </p>
    </div>

    <template v-else-if="campaign">
      <h1 class="text-2xl font-bold text-gray-900">{{ campaign.name }}</h1>

      <div class="mt-3 flex items-center gap-2 text-sm text-gray-600">
        <span
          class="inline-flex h-5 w-5 shrink-0 text-gray-600 [&_svg]:h-full [&_svg]:w-full"
          v-html="deviceInfo.icon"
        />
        <span>{{ deviceInfo.label }}</span>
      </div>

      <p class="mt-3 text-sm text-gray-700">
        {{ conversionRate }}% overall conversion
      </p>

      <div class="mt-8 space-y-4">
        <FunnelStep
          v-for="(step, index) in stepsWithMetrics"
          :key="step.id"
          :step="step"
          :step-number="index + 1"
          :is-worst="index === worstStepIndex"
          :is-first="index === 0"
          :total-views="totalViews"
        />
      </div>

      <div class="mt-8 rounded-lg border border-gray-200 bg-white p-5">
        <h2 class="font-semibold text-gray-900">Insights</h2>
        <p class="mt-2 text-sm text-gray-500">Coming in Phase E</p>
      </div>
    </template>
  </div>
</template>
