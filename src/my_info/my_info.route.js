/**
 * 我的信息路由
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 模块
 */

const MyInfo = Loadable({ 
    loader: () => import('./index.jsx'),
    loading: Loading
})

// 路由配置
const routes = [
    {key: '/app/my-info', component: 'MyInfo', title: '我的信息'},
    {key: '/app/my-info/:mid', component: 'MyInfo'}
]

const modules = {
    MyInfo
}

export default {
    routes,
    modules
};