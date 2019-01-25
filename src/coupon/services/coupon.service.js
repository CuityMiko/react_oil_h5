/**
 * 卡券服务
 */

import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {GetCouponSquareListUrl, GetCouponDetailUrl, TakeCouponUrl, GetMemberCouponsUrl, findCouponUrl} from './coupon.url';
import moment from 'moment';

/**
 * 获取卡券广场列表
 */
const GetCouponSquareList = (pageindex, pagesize) => {
    const deferred = q.defer();
    httpHelper.get(GetCouponSquareListUrl, {
        pageNO: pageindex,
        pageSize: pagesize
    }).then((res) => {
        if (res != null && res.total > 0) {
            let result = {total: res.total, items: []}
            res.items.map(item => {
                let applyGoods = '-';
                let date = '';
                if (item.skus && item.skus.length > 0) {
                    applyGoods = item.skus.filter(s=>s.skuName!=null).map(s=>s.skuName).join('/');
                }
                // dateType 卡券使用有效期类型 0-固定时间 1-立即生效
                if(item.dateType == 0) {
                    date = `${moment(item.useTimeBegin).format('MM.DD')} - ${moment(item.useTimeEnd).format('MM.DD')}`
                } else if(item.dateType == 1) {
                    date = `领取后${item.fixedTerm}天有效`
                }
                result.items.push({...item, date, applyGoods})
            })
            deferred.resolve(result);
        } else {
            deferred.resolve(null);
        }
    })
    .catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

/**
 * 获取卡券详情
 * @param {*} data couponId: 卡券id couponNumber: 卡券编号 
 */
const GetCouponDetail = (data) => {
    const deferred = q.defer();
    httpHelper.get(GetCouponDetailUrl, data).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

// 获取卡券详情（用于二维码推广）
const findCoupon = function (data) {
    let deferred = q.defer();
    httpHelper.get(findCouponUrl + data)
        .then((res) => {
            let applyGoods = '-';
            let result = res;
            if (res.skus && res.skus.length > 0) {
                applyGoods = res.skus.filter(s=>s.skuName!=null).map(s=>s.skuName).join('/');
            }
            result.date = `${moment(res.actTimeStart).format('MM.DD')} - ${moment(res.actTimeEnd).format('MM.DD')}`;
            result.applyGoods = applyGoods;
            deferred.resolve(result);
        })
        .catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
};

/**
 * 领取卡券
 * @param {*} id 
 */
const TakeCoupon = (id) => {
    const deferred = q.defer();
    httpHelper.postWithRes(TakeCouponUrl, {id}).then(res => {
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

/**
 * 获取用户卡包
 * @param {*} data 
 */
const GetMemberCoupons = (data) => {
    const deferred = q.defer();
    httpHelper.get(GetMemberCouponsUrl, data).then(res => {
        if (res != null && res.total > 0) {
            let result = {total: res.total, items: []}
            res.items.map(item => {
                let applyGoods = '-';
                let date = '';
                if (item.gasMbrProSkuDTOS && item.gasMbrProSkuDTOS.length > 0) {
                    applyGoods = item.gasMbrProSkuDTOS.filter(s=>s.skuName!=null).map(s=>s.skuName).join('/');
                }
                // dateType 卡券使用有效期类型 0-固定时间 1-立即生效
                if(item.dateType == 0) {
                    date = `${moment(item.useTimeBegin).format('MM.DD')} - ${moment(item.useTimeEnd).format('MM.DD')}`
                } else if(item.dateType == 1) {
                    date = `${moment().format('MM.DD')} - ${moment().add(item.fixedTerm-1, 'days').format('MM.DD')}`
                }
                let _ritem = {
                    id: item.id,
                    status: item.status,
                    amount: item.couponAmount,
                    leastCost: item.leastCost,
                    name: item.couponName,
                    date,
                    applyGoods,
                    actTimeStart: item.useTimeBegin,
                    actTimeEnd: item.useTimeEnd,
                    couponNumber: item.couponNumber
                }
                result.items.push(_ritem)
            })
            deferred.resolve(result);
        } else {
            deferred.resolve(null);
        }
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    GetCouponSquareList,
    GetCouponDetail,
    TakeCoupon,
    GetMemberCoupons,
    findCoupon
}