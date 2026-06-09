import { readonly, ref } from 'vue'
import campaignsData from '@/data/campaigns.json'
import type { Campaign, CampaignsData } from '@/types'
import { roundToOneDecimal } from '@/utils/math'

export function useCampaigns() {
  const data = campaignsData as CampaignsData
  const campaigns = readonly(ref(data.campaigns))

  function getOverallConversionRate(campaign: {
    steps: readonly { views: number; proceeds: number }[]
  }): number {
    const firstStep = campaign.steps[0]
    const lastStep = campaign.steps[campaign.steps.length - 1]

    if (!firstStep || !lastStep || firstStep.views === 0) {
      return 0
    }

    const rawRate = (lastStep.proceeds / firstStep.views) * 100
    return roundToOneDecimal(Math.min(100, rawRate))
  }

  return { campaigns, getOverallConversionRate }
}
