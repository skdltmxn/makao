import VueRouter from 'vue-router';
import Vue from 'vue';

import Home from '@/components/Home.vue';
import Account from '@/components/Account.vue';
import Service from '@/components/Service.vue';

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/account',
            name: 'Account',
            component: Account,
        },
        {
            path: '/service',
            name: 'Service',
            component: Service,
        }
    ]
});
