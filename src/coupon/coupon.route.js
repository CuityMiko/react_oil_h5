/**
 * 卡券路由
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 模块
 */

// 卡券广场
const CouponList = Loadable({
        loader: () => import('./containers/coupon_square/List.jsx'),
        loading: Loading
});

// 卡券详情
const CouponDetail = Loadable({
    loader: () => import('./containers/coupon_square/Detail.jsx'),
    loading: Loading
});

// 我的卡包
const CouponPackage = Loadable({
    loader: () => import('./containers/coupon_package/CouponPackage.jsx'),
    loading: Loading
});

// 路由
const routes = [
    {key: '/app/coupon/list', component: 'CouponList', title: '卡券广场'},
    {key: '/app/coupon/detail/:id', component: 'CouponDetail', title: '卡券详情'},
    {key: '/app/coupon/coupon_package', component: 'CouponPackage', title: '我的卡包'}
];

const modules = {
    CouponList,
    CouponDetail,
    CouponPackage
};

export default {
    routes,
    modules
};