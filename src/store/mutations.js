import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutations-types'

export default {  
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    // 添加的新商品默认给一个选中状态
    payload.checked = true
    state.cartList.push(payload)
  }
}