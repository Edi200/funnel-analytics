# Funnel Analytics

A small funnel analytics web app for popup campaigns. Marketers can see step-by-step drop-off data for each campaign and quickly identify the worst-performing steps.

## Screenshots

![Campaign List](./screenshots/screenshot-1.png)
![Campaign Detail – worst + critical steps](./screenshots/screenshot-2.png)
![Campaign Detail – performing well](./screenshots/screenshot-3.png)
![Campaign Detail – worst + critical (first step)](./screenshots/screenshot-4.png)
![Campaign Detail – 4-step funnel without critical](./screenshots/screenshot-5.png)

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Project structure

```
src/
├── assets/
│   ├── fonts/          # DM Sans, Inter
│   └── icons/          # SVG icons (Heroicons)
├── components/
│   ├── CampaignCard.vue
│   ├── FunnelStep.vue
│   └── InsightsPanel.vue
├── composables/
│   ├── useCampaigns.ts
│   └── useFunnelMetrics.ts
├── data/
│   └── campaigns.json
├── types/
│   └── index.ts
└── views/
    ├── CampaignListView.vue
    └── CampaignDetailView.vue
```

See [WRITEUP.md](./WRITEUP.md) for design decisions, v1 scope, and AI usage.
