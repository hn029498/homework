import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname,"src")
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        charset: false,
        additionData: '@import "./src/assets/css/global.less"'
      }
    },

    // loaderOptions: {
    //   less: {
    //     lessOptions: {
    //       javascriptEnabled: true
    //     }
    //   }
    // }
  },
  server: {
    proxy: {
      "/v1": {
        target: "http://zypapi.test.zonstmall.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, "/v1")
      }
    }
  }
})
