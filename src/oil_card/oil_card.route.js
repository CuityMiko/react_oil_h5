/**
 * 油卡路由
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 模块
 */

 // 选择油卡
const Activation = Loadable({ 
    loader: () => import('./containers/activation/Activation.jsx'),
    loading: Loading
})

// 我的油卡
const OilDetail = Loadable({ 
    loader: () => import('./containers/detail/OilDetail.jsx'),
    loading: Loading
})

// 路由配置
const routes = [
    {key: '/app/oilcard/activation', component: 'Activation', title: '选择油卡'},
    {key: '/app/member/detail', component: 'OilDetail', title: '我的油卡'}
]

const modules = {
    Activation,
    OilDetail
}

export default {
    routes,
    modules
};