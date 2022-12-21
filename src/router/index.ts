import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import Home from "../views/Home.vue";
import Version from "../views/Version.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '',
        name: 'default',
        component: Home,
        meta: {
            type: "cat"
        }
    },
    {
        path: '/search/:searchKey?',
        name: 'Home',
        component: Home
    },
    {
        path: '/versions/:type',
        name: 'Version',
        component: Version
    }
]
const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router