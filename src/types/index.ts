export interface Step {
  id: string
  name: string
  type: string
  views: number
  proceeds: number
  description: string
}

export interface StepWithMetrics extends Step {
  dropOffRate: number
}

export interface Campaign {
  id: string
  name: string
  device: 'desktop' | 'mobile'
  steps: Step[]
}

export interface CampaignsData {
  campaigns: Campaign[]
}
