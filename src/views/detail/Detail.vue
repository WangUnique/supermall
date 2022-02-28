<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/> 
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommend"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'
  import BackTop from 'components/content/backTop/BackTop'
  import GoodsList from 'components/content/goods/GoodsList'

  // 请求数据
  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
  import { debouce } from "common/utils"
  import {itemListenerMixin} from 'common/mixin'

  // batter-scroll
  import Scroll from 'components/common/scroll/Scroll'

  // 映射methods
  import { mapActions } from 'vuex'

  export default {
    name: "Detail",
    mixins: [itemListenerMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommend: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        isShowBackTop: false,
      }
    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      GoodsList,
      BackTop,
      Scroll,
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
        // 4, 保存商品详情数据
        this.detailInfo = data.detailInfo
        // 5, 获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // 6, 获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        // 7, 请求推荐数据
        getRecommend().then(res => {
          this.recommend = res.data.list
        })
        // 8, 给getThemeTopY赋值(防抖)
        this.getThemeTopY = debouce(() => {
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          this.themeTopYs.push(Number.MAX_VALUE)
        }, 100)
        // 渲染完后回调该函数,直接放到后面会因为渲染问题无法访问到数据
        // this.$nextTick(() => {
        // })
      })
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // 获取Y值
        const POSITIONY = -position.y
        // 与THEMETOPY的值对比
        let len = this.themeTopYs.length
        for(let i = 0; i < len-1; i++) {
          // if(this.currentIndex !== i && ((i < len -1 && POSITIONY >= this.themeTopYs[i] && POSITIONY < this.themeTopYs[i+1]) || (i === len - 1 && POSITIONY >= this.themeTopYs[i]))){
          //   this.currentIndex = i
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
          if(this.currentIndex !== i && (POSITIONY >= this.themeTopYs[i] && POSITIONY < this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
        // 判断BackTop是否显示，因为position是负数所以取负值
        this.isShowBackTop = (-position.y) > 1000
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 800)
      },
      addToCart() {
        // 1 获取展示信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        // 2 将商品添加到购物车
        // this.$store.commit('addCart', product)
        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res);
        // })
        // 通过mapActions映射到方法后直接调用
        this.addCart(product).then(res => {
          this.$toast.show(res, 2000)
          console.log(this.$toast);
        })
      }
    },
    // 因为keepalive
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 1;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 93px);
    overflow: hidden;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>