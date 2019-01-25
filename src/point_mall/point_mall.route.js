/**
 * 积分商城路由
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 模块
 */

 // 积分商城
const MallList = Loadable({ 
    loader: () => import('./containers/mall/List.jsx'),
    loading: Loading
})

// 商品详情
const MallDetail = Loadable({ 
    loader: () => import('./containers/mall/Detail.jsx'),
    loading: Loading
})

 // 我的提货码
 const DeliveryCode = Loadable({ 
    loader: () => import('./containers/delivery_code/DeliveryCode.jsx'),
    loading: Loading
})

// 积分明细列表
const PointList = Loadable({ 
    loader: () => import('./containers/point_detail/List.jsx'),
    loading: Loading
})

 // 积分明细详情
const PointDetail = Loadable({ 
    loader: () => import('./containers/point_detail/Detail.jsx'),
    loading: Loading
})

// 商品兑换详情
const RedeemDetail = Loadable({ 
    loader: () => import('./containers/mall/RedeemDetail.jsx'),
    loading: Loading
})

// 积分明细
const routes = [
    {key: '/app/mall/list', component: 'MallList', title: '积分商城'},
    {key: '/app/mall/detail/:id', component: 'MallDetail', title: '商品详情'},
    {key: '/app/mall/redeemdetail/:id', component: 'RedeemDetail', title: '兑换详情'},
    {key: '/app/mall/delivery_code', component: 'DeliveryCode', title: '我的提货码'},
    {key: '/app/mall/point_detail', component: 'PointList', title: '积分明细'},
    {key: '/app/mall/point_detail/:id', component: 'PointDetail', title: '积分详情'}
]

const modules = {
    MallList,
    MallDetail,
    DeliveryCode,
    PointList,
    PointDetail,
    RedeemDetail
}

export default {
    routes,
    modules
};