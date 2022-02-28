<template>
    <div class="bottom-bar">
        <div class="button">
            <check-button 
              class="check-button" 
              :is-checked="isSelectAll"
              @click.native="checkClick"></check-button>
            <span>全选</span>
        </div>
        <div class="total-price">
            合计：{{totalPrice}}
        </div>
        <div class="calculate" @click="calcClick">
            去计算({{counted}})
        </div>
    </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'
import {mapGetters} from 'vuex'
export default {
  name: 'CartBottomBar',
  components: {
    CheckButton
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        // 当前状态全选，要变为不选中
        this.cartList.forEach(item => item.checked = false)
      } else {
        this.cartList.forEach(item => item.checked = true) 
      }
    },
    calcClick() {
      if (!this.isSelectAll) {
        this.$toast.show('请选择需要的商品鸭~', 2000)
      }
    }
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice () {
      return '￥' + this.cartList.filter(item => {  // mapGetters结构之后这样写
        return item.checked
      }).reduce((preValue,item) => {
        return preValue + item.price * item.count
      },0).toFixed(2) // toFixed(2) 计算结果保留2位小数
    },
    counted () {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      /*
        item.checked 是被选中的购物车项，取反逻辑为只有没有选中的才会返回并拥有长度
        整体取反是因为.length只有为0的时候也就是没有没选中的才会返回true，否则都会返回false
       */
      // return !(this.cartList.filter(item => !item.checked).length)
      // 这个性能更高一点，上面要遍历一遍，这个只要找到一个就返回false
      if (this.cartList.length === 0) return false   //默认没有数据 也就是undefined 取反就是true 所以要判断一下
      return !this.cartList.find(item => !item.checked)
    }
  },
}
</script>

<style scoped>
.bottom-bar {
    height: 40px;
    line-height: 40px;
    background-color: #eee;
    position: relative;
    z-index: 99;
    display: flex;
    text-align: center;
    font-size: 14px;
}
.button {
    display: flex;
    align-items: center;
    margin-left: 8px;
    width: 60px;
}
.check-button {
    width: 18px;
    height: 18px;
    line-height: 20px;
    margin-right: 5px;
}
.total-price {
    margin-left: 20px;
    flex: 1;
}
.calculate {
    width: 100px;
    background-color: pink;
}
</style>