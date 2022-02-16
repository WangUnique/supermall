<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
    <scroll class="content">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/> 
    </scroll>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'

  // 请求数据
  import {getDetail, Goods, Shop} from 'network/detail'

  // batter-scroll
  import Scroll from 'components/common/scroll/Scroll'
  export default {
    name: "Detail",
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {}
      }
    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll
    },
    created() {
      // 保存传入的iid
      this.iid = this.$route.params.iid

      // 根据iid请求数据
      getDetail(this.iid).then(res => {
        // 1, 获取顶部轮播图数据
        const data = res.result 
        this.topImages = res.result.itemInfo.topImages
        // 2, 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // 3, 创建店铺信息
        this.shop = new Shop(data.shopInfo)
      })
    },
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px);
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>