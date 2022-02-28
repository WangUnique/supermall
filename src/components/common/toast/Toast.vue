<template>
  <div class="toast" v-show="isShow">
    <div>{{message}}</div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  data() {
    return {
      message: '',
      isShow: false
    }
  },
  methods: {
    show(message="默认嘀嘀嘀", duration=2000) {
      this.isShow = true
      this.message = message

      setTimeout(() => {
        this.isShow = false
        this.message = ''
      },duration)
    }
  },
}
</script>

<style scoped>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    background: rgba(0,0,0,.6);
    color: #fff;
    padding: 5px 8px;
    transform: translate(-50%,-50%);
    z-index: 99;
    border-radius: 6px;
  }
</style>