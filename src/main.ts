import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.scss'

// Create Vue app instance
const app = createApp(App)

// Import and use Vue Router
import { router } from './routers'
app.use(router)

// Import and use Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // 中文語系
const elementConfig = { 
    size: 'default' as const, 
    zIndex: 3000,
    locale: zhCn,
}
app.use(ElementPlus, elementConfig)

// Mount the app
app.mount('#app')
