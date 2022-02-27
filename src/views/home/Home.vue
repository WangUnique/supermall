<template>
  <!-- 为什么要给id呢，因为整个home是唯一的，一个项目只有一个首页 -->
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control 
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control" v-show="isTabFixed"/>
    <!-- Better-Scroll 控制的滑动 -->
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"/>
      <feature-view></feature-view>
      <tab-control 
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl2"/>
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

  import {itemListenerMixin} from 'common/mixin'
  import {getHomeMultidata,getHomeGoods} from "network/home"
  export default {
    name: 'Home',
    mixins: [itemListenerMixin],
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
        isShowBackTop: false,
        // 吸顶效果的位置
        tabOffsetTop: 0,
        // 默认情况下是否吸顶
        isTabFixed: false,
        // 默认的留存位置坐标
        saveY: 0,
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
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()

      // 取消全局事件监听
      this.$bus.$off("itemImgLoad", this.itemImgListener)
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
        // 为了使两个tabcontrol的点击选项一致
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 800)
      },
      contentScroll(position) {
        // 判断BackTop是否显示，因为position是负数所以取负值
        this.isShowBackTop = (-position.y) > 1000

        // 决定tabControl是否吸顶（position: fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        // 为吸顶参数赋值
        // 上方这里获取的是一个组件，而组件都有一个元素叫$el 用于获取组建的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
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
    /* padding-top: 44px; */
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* 在使用原生滚动时 防止跟随浏览器一起滚动 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 999; */
  }

  .tab-control {
    /* 相对定位使其在原来位置 */
    position: relative;
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
