/**
 * 处理状态
 */

import {combineReducers} from 'redux';

import * as type from './action-types'

import initState from './init_state'

/**
 * 引入各个模块的reducers
 */

// 登录
import LoginReducers from '@/login/redux/reducers';

// 首页
import HomeReducers from '@/home/redux/reducers';

// 会员卡
import MemberCardReducers from '@/member_card/redux/reducers';

// 油卡
import OilCardReducers from '@/oil_card/oil_card.reducer';

// 我的信息
import MyInfoReducers from '@/my_info/redux/reducers';

// 充值
import StoredValueReducers from '@/stored_value/stored_value.reducer';

// 积分
import PointMallReducers from '@/point_mall/point_mall.reducer';

// 卡券
import CouponReducers from '@/coupon/coupon.reducer';

// 支付
import PaymentReducers from '@/payment/payment.reducer';

// 分享
import ShareReducers from '@/share/share.reducer';

/**
 * 公共reducer
 */

const handleData = (state = {isFetching: true, data: {}}, action) => {
    switch (action.type) {
        case type.REQUEST_DATA:
            return {...state, isFetching: true};
        case type.RECEIVE_DATA:
            return {...state, isFetching: false, data: action.data};
        default:
            return {...state};
    }
};

/**
 * APP全局状态
 * @param {*} state 
 * @param {*} action 
 */
const AppData = (state = initState.AppGlobalState, action) => {
    switch (action.type) {
        case type.RECEIVE_DATA:
        case type.REQUEST_DATA:
            return {
                ...state,
                [action.category]: handleData(state[action.category], action)
            };
        default:
            return {...state};
    }
};

/**
 * 商户信息
 * @param {*} state 
 * @param {*} action 
 */
const MerchantInfo = (state = null, action) => {
    switch (action.type) {
        case type.GET_MERCHANTINFO:
            return {...state, ...action.data};
        default:
            return state;
    }
}

/**
 * 用户登录信息
 * @param {*} state 
 * @param {*} action 
 */
const UserLoginInfo = (state = null, action) => {
    switch (action.type) {
        case type.GET_USERLOGININFO:
            return {...state, ...action.data};
        default:
            return state;
    }
}

/**
 * 获取会员信息
 * @param {*} state 
 * @param {*} action 
 */
const MemberInfo = (state = null, action) => {
    switch (action.type) {
        case type.GET_MEMBERINFO:
            return {...state, ...action.data};
        default:
            return state;
    }
}

// 多函数组合
export default combineReducers({
    AppData,
    MerchantInfo,
    UserLoginInfo,
    MemberInfo,
    ...LoginReducers,
    ...HomeReducers,
    ...MemberCardReducers,
    ...OilCardReducers,
    ...MyInfoReducers,
    ...StoredValueReducers,
    ...PointMallReducers,
    ...CouponReducers,
    ...PaymentReducers,
    ...ShareReducers
})

