/**
 * share路由
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 模块
 */

// 分享卡券
const ShareCoupon = Loadable({
    loader: () => import('./containers/share_coupon/ShareCoupon.jsx'),
    loading: Loading
});

// 路由
const routes = [
    {key: '/app/share/share_coupon', component: 'ShareCoupon', title: '领取优惠券'}
];

const modules = {
    ShareCoupon
};

export default {
    routes,
    modules
};