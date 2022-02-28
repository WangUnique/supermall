import Toast from './Toast'
const obj = {}

// 在main.js启动文件中使用vue.use会在页面最初加载时就调用该页面install函数
// 该函数会自带一个Vue作为参数
obj.install = function (Vue) {
  // 创建组件构造qi
  const toastContrustoer = Vue.extend(Toast)
  // 用new创建一个组件对象
  const toast = new toastContrustoer()
  // 将组件对象手动挂载到一个元素上
  toast.$mount(document.createElement('div'))
  // toast.$el 就是 div了
  document.body.appendChild(toast.$el)


  // 给Vue的原型加上一个toast对象后就能在多个组件中访问到toast
  Vue.prototype.$toast = toast
}

export default obj