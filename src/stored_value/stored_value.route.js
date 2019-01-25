/**
 * 充值路由
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 模块
 */

 // 快速充值
const Recharge = Loadable({ 
    loader: () => import('./containers/recharge/Recharge.jsx'),
    loading: Loading
})

// 充值成功
const RechargeSuccess = Loadable({ 
    loader: () => import('./containers/recharge/RechargeSuccess.jsx'),
    loading: Loading
})

// 充值明细
const StoredValueList = Loadable({ 
    loader: () => import('./containers/detail/StoredValueList.jsx'),
    loading: Loading
})

// 充值详情
const StoredValueDetail = Loadable({ 
    loader: () => import('./containers/detail/StoredValueDetail.jsx'),
    loading: Loading
})

// 路由配置
const routes = [
    {key: '/app/recharge', component: 'Recharge', title: '快速充值'},
    {key: '/app/recharge/success', component: 'RechargeSuccess', title: '充值成功'},
    {key: '/app/stored-value/list', component: 'StoredValueList', title: '充值明细'},
    {key: '/app/stored-value/detail/:id', component: 'StoredValueDetail', title: '充值详情'}
]

const modules = {
    Recharge,
    RechargeSuccess,
    StoredValueList,
    StoredValueDetail
}

export default {
    routes,
    modules
};