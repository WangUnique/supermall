module.exports = {
  configureWebpack: {
    // resolve解决路径相关的问题
    resolve: {
      // 配置文件后缀名
      extensions: [],
      // 配置别名
      // 默认配置过 '@': 'src'
      // store和router不需要配置，因为所有的文件都可以通过$store/$router访问到
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}