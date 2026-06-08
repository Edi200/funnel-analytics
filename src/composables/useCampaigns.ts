import { readonly, ref } from 'vue'
import campaignsData from '@/data/campaigns.json'
import type { Campaign, CampaignsData } from '@/types'

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

export function useCampaigns() {
  const data = campaignsData as CampaignsData
  const campaigns = readonly(ref(data.campaigns))

  function getOverallConversionRate(campaign: Campaign): number {
    const firstStep = campaign.steps[0]
    const lastStep = campaign.steps[campaign.steps.length - 1]

    if (!firstStep || !lastStep || firstStep.views === 0) {
      return 0
    }

    return roundToOneDecimal((lastStep.proceeds / firstStep.views) * 100)
  }

  return { campaigns, getOverallConversionRate }
}
