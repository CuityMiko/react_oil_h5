/**
 * 首页路由
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 模块
 */

const Home = Loadable({ 
    loader: () => import('./index.jsx'),
    loading: Loading
})

// 路由配置
const routes = [
    {key: '/app/home', component: 'Home', title: '会员中心'},
    {key: '/app/home/:mid', component: 'Home'}
]

const modules = {
    Home
}

export default {
    routes,
    modules
};