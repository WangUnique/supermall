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
  import GoodsList from 'components/content/goods/GoodsList'

  // 请求数据
  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
  import { debouce } from "common/utils"
  import {itemListenerMixin} from 'common/mixin'
  // batter-scroll
  import Scroll from 'components/common/scroll/Scroll'
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
        currentIndex: 0
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
      GoodsList,
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
          console.log(this.themeTopYs);
        }, 100)
        // 渲染完后回调该函数,直接放到后面会因为渲染问题无法访问到数据
        // this.$nextTick(() => {
        // })
      })
    },
    methods: {
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
        for(let i = 0; i < len; i++) {
          if(this.currentIndex !== i && ((i < len -1 && POSITIONY >= this.themeTopYs[i] && POSITIONY < this.themeTopYs[i+1]) || (i === len - 1 && POSITIONY >= this.themeTopYs[i]))){
            this.currentIndex = i
            // console.log(this.currentIndex);
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
      }
    },
    mounted() {
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