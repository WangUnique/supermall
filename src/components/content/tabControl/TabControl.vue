<template>
  <div class="tab-control">
    <div v-for="(item, index) in titles" 
    :key="item" 
    class="tab-control-item"
    :class="{active: index === currentIndex}"
    @click="ItemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabControl',
  props: {
    // 因为这个功能的模块即使多处使用也只有文字是不同的
    // 所以这里我们选择通过传入的数据改变文字,而不是用插槽了
    titles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    ItemClick(index) {
      this.currentIndex = index;
      this.$emit('tabClick', index)
    }
  },
}
</script>

<style>
  .tab-control {
    display: flex;
    background-color: #f6f6f6;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
  }

  .tab-control-item {
    flex: 1;
  }

  .tab-control-item span {
    padding: 5px;
  }

  .active {
    color: var(--color-high-text);
  }

  .active span {
    border-bottom: 3px solid var(--color-high-text);
  }
</style>