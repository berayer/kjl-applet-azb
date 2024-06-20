<script setup lang="ts">
import { Application } from '@manycore/custom-ksg-viewer-sdk'
import { Menu as MenuIcon } from '@vicons/carbon'

const sceneRef = ref<null | HTMLDivElement>()
let app: Application | null = null

const showLoading = ref(true)
const actionShow = ref(false)

async function loadScene(designId: string, orderId: number) {
  showLoading.value = true
  const topModels = await Manycore.Custom.Order.findTopModelAsync({
    orderId: orderId
  })

  await app!.sceneService.viewAsync({
    designId: designId,
    modelId: topModels.map((v) => v.topModelId)
  })
  showLoading.value = false
}

onMounted(() => {
  setTimeout(() => {
    showLoading.value = false
  }, 2000)
  // 创建场景
  app = new Application(sceneRef.value!)
  // 窗口变化时重绘场景
  window.addEventListener('resize', () => {
    app!.sceneService.resize()
  })

  loadScene('3FO3QRQEX9DD', 20240508373567)
})
</script>

<template>
  <n-spin :show="showLoading" content-style="--n-opacity-spinning: 0;">
    <template #description> 加载场景中... </template>
    <div class="h-screen flex flex-col">
      <!-- 订单信息 -->
      <div class="h-[20px] pos-absolute top-0 w-full" style="z-index: 999">
        <div class="px-2 py-1 w-full flex justify-between text-lg bg-blue">
          <n-ellipsis>产品名称</n-ellipsis>
          <n-ellipsis>B04132300001_T10_01</n-ellipsis>
          <n-ellipsis>1001</n-ellipsis>
        </div>
      </div>
      <!-- 功能固钉 -->
      <n-float-button :right="15" :bottom="20" style="z-index: 999" @click="actionShow = true">
        <n-icon>
          <menu-icon />
        </n-icon>
      </n-float-button>
      <n-drawer v-model:show="actionShow" placement="bottom">
        <n-drawer-content title="斯通纳">
          《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
        </n-drawer-content>
      </n-drawer>
      <!-- 场景canvas -->
      <div ref="sceneRef" class="flex-1 bg-amber"></div>
    </div>
  </n-spin>
</template>
