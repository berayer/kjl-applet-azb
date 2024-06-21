<script setup lang="ts">
defineProps<{
  icon: string
  label: string
}>()
</script>

<template>
  <div class="flex justify-center py-2">
    <div class="flex items-center justify-center flex-col hover:cursor-pointer">
      <m-icon :name="icon" :size="28"></m-icon>
      <span class="text-size-[14px] text-gray-500 mt-1"> {{ label }} </span>
    </div>
  </div>
</template>
