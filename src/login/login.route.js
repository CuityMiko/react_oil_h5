/**
 * 登录路由
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

import Login from './index';

// 路由配置
const routes = [
    {key: '/app/login', component: 'Login'},
    {key: '/app/login/:merchantid', component: 'Login'}
]

const modules = {
    Login
}

export default {
    routes,
    modules
};