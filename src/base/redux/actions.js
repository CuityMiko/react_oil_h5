/**
 * action工厂模块
 */

import * as type from './action-types';
// 通用业务服务
import BusinessService from '@/common/services/business/business.service';

const requestData = category => ({
    type: type.REQUEST_DATA,
    category
});

export const receiveData = (data, category) => ({
    type: type.RECEIVE_DATA,
    data,
    category
});

/**
 * 获取商户信息同步Action
 * @param {*} data 
 */
const getMerchantInfo = (data) => ({
    type: type.GET_MERCHANTINFO,
    data
})

/**
 * 获取用户登录信息同步Action
 * @param {*} data 
 */
export const GetUserLoginInfoAction = (data) => {
    // 将用户登录信息放入缓存
    let userinfo = {mbrId: data.mbrId, mobile: data.mobile, token: data.token};
    sessionStorage.setItem('userlogininfo', JSON.stringify(userinfo));
    localStorage.setItem('user-token', userinfo.token);
    return {
        type: type.GET_USERLOGININFO,
        data: userinfo
    }
}

/**
 * 获取用户信息同步Action
 * @param {*} data 
 */
const getMemberInfo = (data) => ({type: type.GET_MEMBERINFO, data})

/**
 * 获取商户信息异步Action
 * @param {*} merchantid 
 */
export const GetMerchantInfoAction = (merchantid) => {
    return async dispatch => {
        const merchantinfo = await BusinessService.GetMerchantInfo(merchantid);
        // 将商户信息放入缓存
        sessionStorage.setItem('merchantinfo', JSON.stringify(merchantinfo));
        document.title = merchantinfo.name;
        dispatch(getMerchantInfo(merchantinfo));
    }
}

/**
 * 获取会员信息异步Action
 */
export const GetMemberInfoAction = () => {
    return async dispatch => {
        const memberinfo = await BusinessService.GetMemberInfo();
        // 将会员信息放入缓存中
        sessionStorage.setItem('memberinfo', JSON.stringify(memberinfo));
        dispatch(getMemberInfo(memberinfo));
    }
}