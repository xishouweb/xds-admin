// 加载所有plugins下所有的vue组件
const pluginCom = require.context('@/components/plugins', false, /\.vue$/)
const pulicCom = require.context('@/components/public', false, /\.vue$/)

const modules = {}
pluginCom.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.vue)/g, '')] = pluginCom(key).default
})
pulicCom.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.vue)/g, '')] = pulicCom(key).default
})
export default modules
