<template>
  <!-- 为什么要给id呢，因为整个home是唯一的，一个项目只有一个首页 -->
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <!-- Better-Scroll 控制的滑动 -->
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"/>
      <feature-view></feature-view>
      <tab-control 
      :titles="['流行','新款','精选']" 
      class="tab-control"
      @tabClick="tabClick"/>
      <goods-list :goods="showGoods"/>  
    </scroll>

    <!-- 组件想要直接监听原生事件要增加一个native修饰符 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  // 公共组件
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'
  // 首页子组件
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'
  // 网络请求数据

  import {getHomeMultidata,getHomeGoods} from "network/home"
  import { debounce } from "common/utils"
  export default {
    name: 'Home',
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    // 因为created中的函数执行后如果数据不进行保存就会在函数执行结束后小时
    // 所以在data中创建一个变量来存储数据
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        // 数据默认展示为 pop
        currentType: 'pop',
        // 右下角一键到顶按钮是否显示
        isShowBackTop: false
      }
    },
    created() {
      // 当创建后立马请求数据
      // 请求多个数据的方法
      this.getHomeMultidata(),

      // 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted() {
      // 监听item图片加载 
      // 在mounted里监听是因为为了保证this.$refs是有值的

      const refresh = debounce(this.$refs.scroll.refresh, 200)

      this.$bus.$on('itemImageLoad', () => {
        refresh()
      })
    },
    // 通过计算属性来更改数据的切换
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    methods: {
      /**
       * 事件监听的方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break            
        }
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 800)
      },
      contentScroll(position) {
        // 因为position是负数
        this.isShowBackTop = (-position.y) > 1000
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      /**
       * 网络请求的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list,
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // scroll的特殊性只能刷新一次数据
          // 所以需要通过完成函数来解决
          this.$refs.scroll.finishPullUp()
        })
      }

    },
  };
</script>

<style scoped>
  #home {
    height: 100vh;
    padding-top: 44px;

    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 999;
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 99;
  }

  .content {
    /* margin-top: 44px;
    height: calc(100% - 93px); */
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
