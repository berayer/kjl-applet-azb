<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <native-provider>
      <router-view />
    </native-provider>
  </n-config-provider>
</template>

<style>
root {
  --n-opacity-spinning: 0;
}
</style>
