/**
 * 支付服务
 */

import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {GetSkuDataUrl, ToPayUrl, GetAfterPayCouponUrl, GetWXMerchantUrl} from './payment.url';

/**
 * 获取sku
 */
const GetSkuData = (merchantid) => {
    const deferred = q.defer();
    let url = `${GetSkuDataUrl}/${merchantid}`;
    httpHelper.get(url)
        .then((res) => {
            deferred.resolve(res);
        })
        .catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

/**
 * 支付
 */
const ToPay = (data) => {
    const deferred = q.defer();
    httpHelper.post(ToPayUrl, data)
        .then((res) => {
            deferred.resolve(res);
        })
        .catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

/**
 * 获取支付后优惠券
 */
const GetAfterPayCoupon = (ordernum) => {
    const deferred = q.defer();
    let url = `${GetAfterPayCouponUrl}/${ordernum}`;
    httpHelper.getWithres(url)
        .then((res) => {
            if (res && res.success) {
                deferred.resolve(res.data);
            } else {
                deferred.reject(res.errMsg);
            }
        })
        .catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

/**
 * 获取关注微信公众号链接
 */
const GetWXMerchant = (merchantid) => {
    const deferred = q.defer();
    let url = `${GetWXMerchantUrl}/${merchantid}`;
    httpHelper.get(url)
        .then((res) => {
            deferred.resolve(res);
        })
        .catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

export default {
    GetSkuData,
    ToPay,
    GetAfterPayCoupon,
    GetWXMerchant
}