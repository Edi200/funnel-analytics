<script setup lang="ts">
import { useRouter } from 'vue-router'
import CampaignCard from '@/components/CampaignCard.vue'
import { useCampaigns } from '@/composables/useCampaigns'

const router = useRouter()
const { campaigns, getOverallConversionRate } = useCampaigns()

function navigateToCampaign(id: string) {
  router.push(`/campaign/${id}`)
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <h1 class="mb-6 font-[family-name:var(--font-heading)] text-2xl font-semibold text-[#26215C]">
      Campaign Analytics
    </h1>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CampaignCard
        v-for="campaign in campaigns"
        :key="campaign.id"
        :campaign="campaign"
        :conversion-rate="getOverallConversionRate(campaign)"
        @select="navigateToCampaign(campaign.id)"
      />
    </div>
  </div>
</template>
