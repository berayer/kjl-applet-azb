<script setup lang="ts">
import { Application, ERenderMode } from '@manycore/custom-ksg-viewer-sdk'
import { router } from '@/router'
import { debounce } from 'lodash'

const sceneRef = ref<null | HTMLDivElement>()
let app: Application | null = null

const showLoading = ref(true)
const actionShow = ref(false)
const state = ref({
  floorplanShow: false,
  doorShow: true,
  showModal: false,
  bomValue: 0
})

async function loadScene(designId: string, orderId: number) {
  showLoading.value = true
  const topModels = await Manycore.Custom.Order.findTopModelAsync({
    orderId: orderId
  })

  await app!.sceneService.viewAsync({
    designId: designId,
    modelId: topModels.map((v) => v.topModelId),
    withFloorplan: true
  })

  app!.sceneService.config.renderMode.set(ERenderMode.OUTLINE_WITH_SHADING)
  app!.floorplanService.switchVisibility(state.value.floorplanShow)
  app!.sceneService.resetPerspective()

  showLoading.value = false
}

function displayFloorplan() {
  state.value.floorplanShow = !state.value.floorplanShow
  app!.floorplanService.switchVisibility(state.value.floorplanShow)
  actionShow.value = false
}

function displayDoor() {
  state.value.doorShow = !state.value.doorShow
  app!.visibilityService.setVisibility((it) => it.prodCatId === 498 || it.prodCatId === 708, state.value.doorShow)
  actionShow.value = false
}

function showModelBom() {
  actionShow.value = false
  state.value.showModal = true
}

onMounted(() => {
  // 创建场景
  app = new Application(sceneRef.value!)
  const reload = debounce(() => {
    app!.sceneService.resize()
  }, 100)
  // 窗口变化时重绘场景
  window.addEventListener('resize', () => {
    reload()
  })

  watch(
    () => state.value.bomValue,
    (val) => {
      app?.modelService.explode({ scale: val })
    }
  )

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
        <n-drawer-content title="功能菜单" style="--n-body-padding: 0" :native-scrollbar="false">
          <div class="grid justify-center gap-2 px-3 py-4" style="grid-template-columns: repeat(auto-fill, 80px)">
            <action-button icon="carbon:scan-alt" label="扫描条码" />
            <action-button icon="carbon:model-alt" label="显示模式" />

            <action-button
              icon="carbon:blog"
              label="显示户型"
              :active="state.floorplanShow"
              @click="displayFloorplan"
            />
            <action-button icon="carbon:qr-code" label="输入条码" />
            <action-button icon="carbon:document" label="板件清单" />
            <action-button icon="carbon:cics-explorer" label="模型爆炸" @click="showModelBom" />
            <action-button
              icon="carbon:logo-glassdoor"
              :active="state.doorShow"
              label="显示门板"
              @click="displayDoor"
            />
          </div>
        </n-drawer-content>
      </n-drawer>
      <!-- 场景canvas -->
      <div ref="sceneRef" class="flex-1 bg-[#f0f0f0] overflow-hidden"></div>

      <n-modal v-model:show="state.showModal">
        <n-card
          style="width: 100%; position: fixed; bottom: 0"
          title="爆炸范围"
          :bordered="false"
          role="dialog"
          aria-modal="true"
        >
          <n-slider v-model:value="state.bomValue" :step="1" />
        </n-card>
      </n-modal>
    </div>
  </n-spin>
</template>
