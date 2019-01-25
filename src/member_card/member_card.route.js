/**
 * 会员卡路由
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 模块
 */

 // 会员卡详情
const CardDetail = Loadable({ 
    loader: () => import('./containers/card_detail/CardDetail.jsx'),
    loading: Loading
})

// 会员协议
const Agreement = Loadable({ 
    loader: () => import('./containers/agreement/Agreement.jsx'),
    loading: Loading
})

// 路由配置
const routes = [
    {key: '/app/member/card-detail', component: 'CardDetail', title: '会员卡详情'},
    {key: '/app/member/agreement', component: 'Agreement', title: '会员服务协议'}
]

const modules = {
    CardDetail,
    Agreement
}

export default {
    routes,
    modules
};