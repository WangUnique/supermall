// 封装Better-Scroll
<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad:{
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null ,
      }
    },
    mounted() {
      // 创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      // 监听滚动位置
      if(this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          // 通过自定义事件把实时监控的位置传出去
          this.$emit('scroll', position)
        })
      } 

      // 监听是否滚动到底部
      if(this.pullUpLoad) {
        this.scroll.on("pullingUp", () => {
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      // 封装方法放置Home组件代码过于繁杂难懂
      scrollTo(x, y, time = 500) {
        // this.scroll && 的作用是内部执行顺序的问题导致可能会找不到scroll 从而报错
        console.log('Scroll.vue中__控制主页右下加一键到顶按钮');
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        console.log('Scroll.vue中__控制上拉刷新的');
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        console.log('Scroll.vue中__测试防抖效果 QAQ ');
        this.scroll && this.scroll.refresh()
      },
      getScrollY() {
        console.log('Scroll.vue中__获取当前滚动的Y值');
        return this.scroll ? this.scroll.y : 0
      }
    },
  }
</script>

<style>

</style>