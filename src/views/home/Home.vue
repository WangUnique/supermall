<template>
  <!-- 为什么要给id呢，因为整个home是唯一的，一个项目只有一个首页 -->
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>

    <scroll class="content">
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"/>
      <feature-view></feature-view>
      <tab-control 
      :titles="['流行','新款','精选']" 
      class="tab-control"
      @tabClick="tabClick"/>
      <goods-list :goods="showGoods"/>  
    </scroll>
  </div>
</template>

<script>
  // 公共组件
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  // 首页子组件
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'
  // 网络请求数据

  import {getHomeMultidata,getHomeGoods} from "network/home"
  export default {
    name: 'Home',
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll
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
        currentType: 'pop'
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
      /**
       * 网络请求的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners = res.data.banner.list,
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
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
