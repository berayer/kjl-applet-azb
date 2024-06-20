import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      dts: 'src/typings/auto-import.d.ts',
      imports: ['vue']
    }),
    Components({
      dts: 'src/typings/components.d.ts',
      resolvers: [NaiveUiResolver()]
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 9527,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    https: {
      key: readFileSync('./keys/agent2-key.pem'),
      cert: readFileSync('./keys/agent2-cert.pem')
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url))
    }
  }
})
