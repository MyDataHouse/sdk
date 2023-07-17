import path from 'path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite' //自动导入api
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_BASE_PATH,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      legacy({
        targets: ['defaults', 'not IE 11']
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        resolvers: [ArcoResolver()],
        dts: 'types/auto-imports.d.ts'
      }),
      Components({
        resolvers: [
          ArcoResolver({
            sideEffect: true
          })
        ], //指定类型声明文件，为true时在项目根目录创建
        dts: 'types/components.d.ts'
      })
    ],
    server: {
      host: 'localhost',
      port: parseInt(env.port),
      open: true
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly', // 修改生成的配置对象的key的展示形式(驼峰还是中划线形式)
        scopeBehaviour: 'local', // 配置当前的模块化行为是模块化还是全局化 (有hash就是开启了模块化的一个标志, 因为他可以保证产生不同的hash值来控制我们的样式类名不被覆盖)
        generateScopedName: '[name]_[local]_[hash:5]',
        hashPrefix: 'sdk'
      }
    }
  }
})
