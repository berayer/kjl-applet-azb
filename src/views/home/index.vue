<script setup lang="ts">
import { Application } from '@manycore/custom-ksg-viewer-sdk'
import {
  Menu as MenuIcon,
  ScanAlt,
  ModelAlt,
  CicsExplorer,
  Document,
  LogoGlassdoor,
  QrCode,
  Blog
} from '@vicons/carbon'

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
        <m-icon name="carbon:menu" />
      </n-float-button>
      <n-drawer v-model:show="actionShow" placement="bottom">
        <n-drawer-content title="功能菜单" style="--n-body-padding: 0">
          <n-scrollbar>
            <div class="grid justify-center gap-2 px-3 py-4" style="grid-template-columns: repeat(auto-fill, 80px)">
              <action-button icon="carbon:scan-alt" label="扫描条码" />
              <action-button icon="carbon:model-alt" label="显示模式" />

              <action-button icon="carbon:blog" label="显示户型" />
              <action-button icon="carbon:qr-code" label="输入条码" />
              <action-button icon="carbon:document" label="板件清单" />
              <action-button icon="carbon:cics-explorer" label="模型爆炸" />
              <action-button icon="carbon:logo-glassdoor" label="显示门板" />
            </div>
          </n-scrollbar>
        </n-drawer-content>
      </n-drawer>
      <!-- 场景canvas -->
      <div ref="sceneRef" class="flex-1 bg-amber"></div>
    </div>
  </n-spin>
</template>
