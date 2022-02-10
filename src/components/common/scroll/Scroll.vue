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
      this.scroll.on('scroll', (position) => {
        // 通过自定义事件把实时监控的位置传出去
        this.$emit('scroll', position)
      })
    },
    methods: {
      // 封装方法放置Home组件代码过于繁杂难懂
      scrollTo(x, y, time = 500) {
        this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll.refresh()
      }
    },
  }
</script>

<style>

</style>