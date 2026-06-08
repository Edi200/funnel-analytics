<script setup lang="ts">
import { computed } from 'vue'
import DesktopIcon from '@/assets/icons/desktop.svg?raw'
import MobileIcon from '@/assets/icons/mobile.svg?raw'
import type { Campaign } from '@/types'

interface Props {
  campaign: Pick<Campaign, 'id' | 'name' | 'device'>
  conversionRate: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: []
}>()

const deviceInfo = computed(() => {
  if (props.campaign.device === 'mobile') {
    return { icon: MobileIcon, label: 'Mobile' }
  }

  return { icon: DesktopIcon, label: 'Desktop' }
})

function handleClick() {
  emit('select')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('select')
  }
}
</script>

<template>
  <article
    role="button"
    tabindex="0"
    class="cursor-pointer rounded-xl border border-[#CECBF6] bg-white p-5 transition-all duration-300 hover:shadow-lg"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <h2 class="font-[family-name:var(--font-heading)] text-base font-semibold text-[#26215C]">
      {{ campaign.name }}
    </h2>

    <div class="mt-3 flex items-center gap-2 text-xs text-[#7F77DD]">
      <span
        class="inline-flex h-4 w-4 shrink-0 text-[#7F77DD] [&_svg]:h-full [&_svg]:w-full"
        v-html="deviceInfo.icon"
      />
      <span>{{ deviceInfo.label }}</span>
    </div>

    <p class="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-[#534AB7]">
      {{ conversionRate }}%
    </p>
    <p class="text-xs text-[#888780]">overall conversion</p>
  </article>
</template>
