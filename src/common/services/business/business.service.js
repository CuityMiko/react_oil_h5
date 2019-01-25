/**
 * 公共业务服务
 */
import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {GetMerchantInfoUrl, GetMemberInfoUrl, JudgeIsMemberUrl} from './business.url';

/**
 * 获取商户信息
 * @param {*} merchantid 商户ID
 */
const GetMerchantInfo = function (merchantid) {
    const deferred = q.defer();
    const url = `${GetMerchantInfoUrl}/${merchantid}`;
    httpHelper.get(url, {}, {isLoading: false}).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 获取会员信息
 */
const GetMemberInfo = function () {
    const deferred = q.defer();
    httpHelper.get(GetMemberInfoUrl, {}, {isLoading: false}).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 判断是否是会员
 * @param {*} data code 微信授权code 如果登录则传空字符串 merchantId 商户id
 */
const JudgeIsMember = function (data) {
    const deferred = q.defer();
    httpHelper.getWithres(JudgeIsMemberUrl, data).then(res => {
        if (res && res.success) {
            deferred.resolve(res.data);
        } else {
            deferred.reject(res.errMsg);
        }
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    GetMerchantInfo,
    GetMemberInfo,
    JudgeIsMember
}

