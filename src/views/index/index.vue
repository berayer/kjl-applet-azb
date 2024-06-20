<script setup lang="ts">
const input = ref('')
</script>

<template>
  <div class="flex justify-center items-center h-screen px-4">
    <n-card class="bg-gray-50">
      <n-form>
        <n-form-item :show-feedback="false" :show-label="false">
          <n-input placeholder="请输入订单号或板件条码" v-model:value="input"></n-input>
        </n-form-item>

        <n-form-item :show-feedback="false">
          <n-button class="w-full" type="primary">确定</n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>
