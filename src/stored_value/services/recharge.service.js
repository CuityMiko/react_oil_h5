/**
 * 充值服务
 */

import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {GetRechargeConfigUrl, GetRechargeRuleDataUrl, ToRechargeUrl, GetRechargeResultUrl, GetRechargeDetailListUrl, GetRechargeDetailInfoUrl} from './recharge.url';

/**
 * 获取充值规则设置
 * @param {*} id 卡种ID
 */
const GetRechargeConfig = (id) => {
    const deferred = q.defer();
    let url = `${GetRechargeConfigUrl}/${id}`;
    httpHelper.get(url).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 获取充值规则
 * @param {*} cardSpecId 卡种ID
 * @param {*} merchantId 商户ID
 */
const GetRechargeRuleData = (cardSpecId, merchantId) => {
    const deferred = q.defer();
    httpHelper.get(GetRechargeRuleDataUrl, {cardSpecId, merchantId}).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 充值下单
 * @param {*} data 
 */
const ToRecharge = (data) => {
    const deferred = q.defer();
    httpHelper.post(ToRechargeUrl, data).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 获取充值结果
 * @param {*} orderid 
 */
const GetRechargeResult = (orderid) => {
    const deferred = q.defer();
    let url = `${GetRechargeResultUrl}/${orderid}`;
    httpHelper.getWithres(url, {}, {isLoading: false}).then(res => {
        if (res != null) {
            deferred.resolve(res.data);
        } else {
            deferred.reject(null);
        }
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 获取充值明细列表
 * @param {*} data 
 */
const GetRechargeDetailList = (data) => {
    const deferred = q.defer();
    httpHelper.get(GetRechargeDetailListUrl, data).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 获取充值明细详情
 * @param {*} id 
 */
const GetRechargeDetailInfo = (id) => {
    const deferred = q.defer();
    let url = `${GetRechargeDetailInfoUrl}/${id}`;
    httpHelper.get(url).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
} 

export default {
    GetRechargeConfig,
    GetRechargeRuleData,
    ToRecharge,
    GetRechargeResult,
    GetRechargeDetailList,
    GetRechargeDetailInfo
}