<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  name: string
  color?: string
  size?: number | string
  depth?: 1 | 2 | 3 | 4 | 5
}>()
</script>

<template>
  <n-icon :size="size || 20" :depth="depth" :color="color">
    <Icon :icon="name" />
  </n-icon>
</template>
