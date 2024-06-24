import wx from 'weixin-js-sdk'
import sha1 from 'sha1'

export function setupWxConfig() {
  const timestamp = Number(new Date().getTime().toString())
  const ticket = 'LIKLckvwlJT9cWIhEQTwfDo_qVKF3QzRYtZf3QpfNOmgTW1Y8osT-G-SkyNmPkDdiXETfSegPmrPnhpfVLXg1Q'
  const nonceStr = 'f13da4dd'
  const signature = sha1(
    `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=https://pano430.p.kujiale.com/pub/saas/customized-cms/miniapp?enableMiniappDev=true&launchMiniapp=ttt`
  )

  wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wx8d55e43a01ce5aec', // 必填，公众号的唯一标识
    timestamp: timestamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: signature, // 必填，签名
    jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
  })
}

export function wxScanQRCode(success: (res: { resultStr: string }) => void, fail: (...args: any[]) => void) {
  wx.scanQRCode({
    needResult: 1,
    scanType: ['qrCode'],
    success,
    fail
  })
}
