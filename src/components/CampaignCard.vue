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
    class="cursor-pointer rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <h2 class="font-bold text-gray-900">{{ campaign.name }}</h2>

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
  </article>
</template>
