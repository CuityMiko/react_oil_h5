/**
 * 支付路由
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 模块
 */

// CToB
const CToB = Loadable({
    loader: () => import('./containers/c_to_b/CToB.jsx'),
    loading: Loading
});

// 付款成功
const PaySuccess = Loadable({
    loader: () => import('./components/pay_success/PaySuccess.jsx'),
    loading: Loading
});

// 路由
const routes = [
    {key: '/app/payment', component: 'CToB'},
    {key: '/app/payment/pay_success', component: 'PaySuccess', title: '付款结果'}
];

const modules = {
    CToB,
    PaySuccess
};

export default {
    routes,
    modules
};