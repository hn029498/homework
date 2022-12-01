import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css' // 适用iview css

createApp(App).use(router).use(ViewUIPlus).mount('#app')
