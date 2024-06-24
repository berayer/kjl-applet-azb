<script setup lang="ts">
import { Application, ERenderMode } from '@manycore/custom-ksg-viewer-sdk'
import { debounce } from 'lodash'
import { getByBarCode, getByOrderNo } from '@/api'
import wx from 'weixin-js-sdk'

const boardInfo = ref({
  orderNo: '',
  productName: '还未加载订单'
})

const sceneRef = ref<null | HTMLDivElement>()
let app: Application | null = null

type ModalType = 'none' | 'input' | 'bom' | 'model'
const state = ref({
  /** 场景是否初始化 */
  sceneInit: false,
  /** 场景是否加载中 */
  sceneLoading: false,
  /** 功能菜单是否显示 */
  functionDrawerShow: false,
  /** 户型是否显示 */
  floorplanShow: false,
  /** 门板是否显示 */
  hideDoors: false,
  /** 模态框标题 */
  modalTitle: '',
  /** 爆炸范围控件是否显示 */
  // bomModalShow: false,
  /** 门板爆炸范围 */
  bomValue: 0,
  /** 条码输入框是否显示 */
  // inputModalShow: false,
  /** 条码值 */
  inputValue: '',
  /** 模态框是否显示 */
  modalShow: false,
  /** 模态框类型 */
  modalType: 'none' as ModalType,
  /** 渲染模式 */
  activeModel: ERenderMode.OUTLINE_WITH_SHADING
})

/** 加载订单场景 */
async function loadScene(designId: string, orderId: number) {
  // loading start
  state.value.sceneLoading = true
  // 获取顶层模型ids
  const topModels = await Manycore.Custom.Order.findTopModelAsync({
    orderId: orderId
  })
  // 等待加载场景及户型
  await app!.sceneService.viewAsync({
    designId: designId,
    modelId: topModels.map((v) => v.topModelId),
    withFloorplan: true
  })
  // 设置渲染模式, 关闭户型显示, 重置相机视角
  app!.sceneService.config.renderMode.set(state.value.activeModel)
  app!.floorplanService.switchVisibility(state.value.floorplanShow)
  app!.sceneService.resetPerspective()
  // loading end
  state.value.sceneLoading = false
  state.value.sceneInit = true
}

/** 控制是否显示户型 */
function displayFloorplan() {
  state.value.floorplanShow = !state.value.floorplanShow
  app!.floorplanService.switchVisibility(state.value.floorplanShow)
  state.value.functionDrawerShow = false
}

/** 控制是否显示门抽 */
function displayDoor() {
  state.value.hideDoors = !state.value.hideDoors
  app!.visibilityService.setVisibility((it) => it.prodCatId === 498 || it.prodCatId === 708, !state.value.hideDoors)
  state.value.functionDrawerShow = false
}

/** 控制模态框显示 */
function showModal(type: ModalType, title: string) {
  state.value.functionDrawerShow = false
  state.value.modalTitle = title
  state.value.modalType = type
  state.value.modalShow = true
}

const isOrderOrBarCode = /^[A-Z]\d{11}_T\d{2}_\d{2}(\d{4})?$/
async function submitInput() {
  const val = state.value.inputValue
  if (!isOrderOrBarCode.test(val)) {
    window.$message?.warning('请输入正确的订单号或条码')
  } else {
    const orderNo = val.slice(0, 19)
    const barCode = val.slice(19, 23)

    await selectOrderNo(orderNo)
    await selectBarCode(barCode)
  }
  state.value.inputValue = ''
}

function fetchOrderNo(orderNo: string) {
  state.value.modalShow = false
  getByOrderNo(orderNo).then((res) => {
    if (res.designId) {
      loadScene(res.designId, res.designNo)
      boardInfo.value.orderNo = orderNo
      boardInfo.value.productName = res.productName
    } else {
      window.$message?.error('未找到该订单')
    }
  })
}

function selectOrderNo(orderNo: string) {
  if (boardInfo.value.orderNo === orderNo) return

  if (boardInfo.value.orderNo) {
    window.$dialog?.warning({
      title: '提示',
      content: '是否要切换订单: ' + orderNo + '?',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: () => {
        window.$message?.success('确定')
        fetchOrderNo(orderNo)
      },
      onNegativeClick: () => {
        window.$message?.error('不确定')
      }
    })
  } else {
    fetchOrderNo(orderNo)
  }
}

function selectBarCode(barCode: string) {
  if (!barCode) return
}

function changeRenderModel(mode: ERenderMode) {
  state.value.activeModel = mode
  app!.sceneService.config.renderMode.set(mode)
  state.value.modalShow = false
}

function wxTest() {
  wx.scanQRCode({
    needResult: 1,
    scanType: ['qrCode', 'barCode'],
    success: (res) => {
      console.log(res)
    },
    fail: (res) => {
      console.log(res)
    }
  })
}

onMounted(() => {
  // 创建场景
  app = new Application(sceneRef.value!)
  // 窗口变化时重绘场景, 使用防抖
  const reload = debounce(() => {
    app!.sceneService.resize()
  }, 100)
  window.addEventListener('resize', () => {
    reload()
  })
  // 监听爆炸范围数值变化
  watch(
    () => state.value.bomValue,
    (val) => {
      app?.modelService.explode({ scale: val })
    }
  )
})
</script>

<template>
  <n-spin :show="state.sceneLoading" content-style="--n-opacity-spinning: 0;">
    <template #description> 加载场景中... </template>
    <div class="h-screen flex flex-col">
      <!-- 订单信息 -->
      <div class="h-[20px] pos-absolute top-0 w-full" style="z-index: 999">
        <div class="px-2 py-1 w-full flex justify-between text-lg bg-blue">
          <n-ellipsis>{{ boardInfo.productName }}</n-ellipsis>
          <n-ellipsis> {{ boardInfo.orderNo }}</n-ellipsis>
          <!-- <n-ellipsis>1001</n-ellipsis> -->
        </div>
      </div>
      <!-- 功能固钉 -->
      <n-float-button :right="15" :bottom="20" style="z-index: 999" @click="state.functionDrawerShow = true">
        <m-icon name="carbon:menu" />
      </n-float-button>
      <n-drawer v-model:show="state.functionDrawerShow" placement="bottom">
        <n-drawer-content title="功能菜单" style="--n-body-padding: 0" :native-scrollbar="false">
          <div class="grid justify-center gap-2 px-3 py-4" style="grid-template-columns: repeat(auto-fill, 80px)">
            <action-button icon="carbon:scan-alt" label="扫描条码" @click="wxTest" />
            <action-button icon="carbon:qr-code" label="输入条码" @click="showModal('input', '输入条码')" />
            <action-button
              v-if="state.sceneInit"
              icon="carbon:model-alt"
              label="显示模式"
              @click="showModal('model', '显示模式')"
            />

            <action-button
              v-if="state.sceneInit"
              icon="carbon:blog"
              label="显示户型"
              :active="state.floorplanShow"
              @click="displayFloorplan"
            />
            <action-button v-if="state.sceneInit" icon="carbon:document" label="板件清单" />
            <action-button
              v-if="state.sceneInit"
              icon="carbon:cics-explorer"
              label="模型爆炸"
              @click="showModal('bom', '模型爆炸')"
            />
            <action-button
              v-if="state.sceneInit"
              icon="carbon:logo-glassdoor"
              :active="state.hideDoors"
              label="隐藏门抽"
              @click="displayDoor"
            />
          </div>
        </n-drawer-content>
      </n-drawer>
      <!-- 场景canvas -->
      <div ref="sceneRef" class="flex-1 bg-[#f0f0f0] overflow-hidden"></div>

      <n-modal v-model:show="state.modalShow">
        <n-card
          style="width: 100%; position: fixed; bottom: 0"
          :title="state.modalTitle"
          :bordered="false"
          role="dialog"
          aria-modal="true"
        >
          <n-slider v-if="state.modalType === 'bom'" v-model:value="state.bomValue" :step="1" />

          <n-flex v-if="state.modalType === 'input'">
            <n-input
              v-model:value="state.inputValue"
              placeholder="请输入订单号或者板件条码"
              @keyup.enter="submitInput"
            />
          </n-flex>

          <n-flex v-if="state.modalType === 'model'" justify="center">
            <n-button-group>
              <n-button
                :type="state.activeModel === ERenderMode.SHADING ? 'primary' : undefined"
                @click="changeRenderModel(ERenderMode.SHADING)"
                >材质模式</n-button
              >
              <n-button
                :type="state.activeModel === ERenderMode.OUTLINE_ONLY ? 'primary' : undefined"
                @click="changeRenderModel(ERenderMode.OUTLINE_ONLY)"
                >线框模式</n-button
              >
              <n-button
                :type="state.activeModel === ERenderMode.OUTLINE_WITH_SHADING ? 'primary' : undefined"
                @click="changeRenderModel(ERenderMode.OUTLINE_WITH_SHADING)"
                >材质线框</n-button
              >
              <n-button
                :type="state.activeModel === ERenderMode.TRANSPARENT_LINE ? 'primary' : undefined"
                @click="changeRenderModel(ERenderMode.TRANSPARENT_LINE)"
                >透明线框</n-button
              >
            </n-button-group>
          </n-flex>
        </n-card>
      </n-modal>
    </div>
  </n-spin>
</template>
