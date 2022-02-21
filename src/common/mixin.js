import { debouce } from "common/utils"
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    // 监听item图片加载 
    // 在mounted里监听是因为为了保证this.$refs是有值的
    const refresh = debouce(this.$refs.scroll.refresh, 200)
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener
    )
  },
}