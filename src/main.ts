import {createApp} from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
// import EP from 'element-plus'
// import 'element-plus/dist/index.css'
import axios from 'axios';
import MyAxios from './myaxios.d';
import VueAxios from 'vue-axios';
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }
app.use(router).use(VueAxios, axios)
// if (import.meta.env.VITE_ENV === 'pro') {
//     app.use(ElementPlus)
// } else {
//     app.use(EP)
// }
app.use(ElementPlus).mount('#app')
app.config.globalProperties.$axios = MyAxios;