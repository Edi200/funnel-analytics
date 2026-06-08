import { createRouter, createWebHistory } from 'vue-router'
import CampaignListView from '@/views/CampaignListView.vue'
import CampaignDetailView from '@/views/CampaignDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'campaign-list', component: CampaignListView },
    { path: '/campaign/:id', name: 'campaign-detail', component: CampaignDetailView },
  ],
})

export default router
