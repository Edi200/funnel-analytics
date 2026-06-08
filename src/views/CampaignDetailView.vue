<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DesktopIcon from '@/assets/icons/desktop.svg?raw'
import MobileIcon from '@/assets/icons/mobile.svg?raw'
import FunnelStep from '@/components/FunnelStep.vue'
import InsightsPanel from '@/components/InsightsPanel.vue'
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

const { stepsWithMetrics, worstStep, worstStepIndex } = useFunnelMetrics(
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
      class="mb-6 flex items-center gap-1 text-sm text-[#7F77DD] hover:text-[#534AB7]"
      @click="goBack"
    >
      ← Back
    </button>

    <div v-if="isNotFound">
      <h1 class="font-[family-name:var(--font-heading)] text-2xl font-semibold text-[#26215C]">
        Campaign not found
      </h1>
      <p class="mt-2 text-sm text-[#888780]">
        The campaign you're looking for doesn't exist.
      </p>
    </div>

    <template v-else-if="campaign">
      <h1 class="mb-2 font-[family-name:var(--font-heading)] text-2xl font-semibold text-[#26215C]">
        {{ campaign.name }}
      </h1>

      <div class="mb-1 flex items-center gap-2 text-sm text-[#7F77DD]">
        <span
          class="inline-flex h-4 w-4 shrink-0 text-[#7F77DD] [&_svg]:h-full [&_svg]:w-full"
          v-html="deviceInfo.icon"
        />
        <span>{{ deviceInfo.label }}</span>
      </div>

      <p class="mb-6 text-sm text-[#888780]">
        {{ conversionRate }}% overall conversion
      </p>

      <div class="space-y-4">
        <FunnelStep
          v-for="(step, index) in stepsWithMetrics"
          :key="step.id"
          :step="step"
          :step-number="index + 1"
          :is-worst="index === worstStepIndex"
          :is-critical="worstStepIndex !== -1 && index !== worstStepIndex && step.dropOffRate >= 60"
          :is-last="index === stepsWithMetrics.length - 1"
          :total-views="totalViews"
        />
      </div>

      <InsightsPanel
        :steps-with-metrics="stepsWithMetrics"
        :worst-step="worstStep"
        :overall-conversion-rate="conversionRate"
      />
    </template>
  </div>
</template>
