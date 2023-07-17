import { createApp, h } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { vueBridge } from '@garfish/bridge-vue-v3'
// import 'normalize.css/normalize.css'
// import '@/assets/style/parentVariable.css'
import '@/assets/style/variable.css'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import { registerStore, store } from '@/stores'
import routes from '@/router'

function newRouter(basename: string) {
  const router = createRouter({
    history: createWebHistory(basename),
    routes: routes
  })
  return router
}

export const provider = vueBridge({
  rootComponent: App,
  // 可选，注册 vue-router或状态管理对象
  appOptions: ({ basename, dom, appName, props }) => {
    console.log(basename, dom, appName, props)
    return {
      el: '#app',
      render: () => h(App)
    }
  },
  handleInstance: (
    vueInstance,
    { basename, dom, appName, props, appRenderInfo }
  ) => {
    console.log(basename, dom, appName, props, appRenderInfo)
    vueInstance.use(newRouter(basename))
    vueInstance.use(store)
    registerStore() //注册pinia状态管理库
    vueInstance.use(ArcoVueIcon)
  }
})

if (!window.__GARFISH__) {
  const app = createApp(App)
  app.use(newRouter('/'))
  app.use(store)
  registerStore() //注册pinia状态管理库
  app.use(ArcoVueIcon)
  app.mount('#app')
}
