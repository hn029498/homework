import {createRouter,createWebHashHistory,RouteRecordRaw} from 'vue-router'
let routes:Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: {name: 'home'},
    },
    {
        path: '/home',
        name: 'home',
        redirect: {name: 'lesson1'},
        component: ()=> import('../page/home.vue'),
        children: [
            {
                path: '/lesson1',
                name: 'lesson1',
                component: ()=> import('../page/lesson1.vue'),
            },
            {
                path: '/lesson2',
                name: 'lesson2',
                component: ()=> import('../page/lesson2.vue'),
            },
            {
                path: '/lesson3',
                name: 'lesson3',
                component: ()=> import('../page/lesson3.vue'),
            },
            {
                path: '/lesson4',
                name: 'lesson4',
                component: ()=> import('../page/lesson4/index.vue'),
            },
            {
                path: '/lesson5',
                name: 'lesson5',
                component: ()=> import('../page/lesson5.vue'),
            }
        ]
    }
]
let router = createRouter({
    history:createWebHashHistory(),
    routes
})
export default router