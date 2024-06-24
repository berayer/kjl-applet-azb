import axios from 'axios'

const http = axios.create({
  baseURL: '/v2',
  timeout: 10000
})

http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

/** 获取板件信息及id */
export function getByBarCode(barCode: string) {
  return http({
    url: '/barCode',
    method: 'get',
    params: { barCode }
  })
}

/** 获取订单的方案号 */
export function getByOrderNo(orderNo: string) {
  return http<any, any>({
    url: '/orderNo',
    method: 'get',
    params: { orderNo }
  })
}
