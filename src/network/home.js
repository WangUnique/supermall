import {request} from './request'

// 为了使得维护更加清晰明了
// 首页 可以直接面向该 home.js 开发即可
// 避免了封装的request.js变得更加庞大且不清晰
export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

export function getHomeGoods(type, page) {
  return request({
    url: './home/data',
    params: {
      type,
      page
    }
  })
}