/**
 * 积分商城服务
 */

import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {GetMallListUrl, GetGoodsDetailUrl, RedeemGoodsUrl, GetGoodsRedeemRecordUrl} from './mall.url';

/**
 * 获取积分商城列表（分页）
 * @param {*} pageindex 当前页
 * @param {*} pagesize 页大小
 */
const GetMallList = (pageindex, pagesize) => {
    const deferred = q.defer();
    httpHelper.get(GetMallListUrl, {
        pageNO: pageindex,
        pageSize: pagesize,
        status: 1
    }).then((res) => {
        if (res != null && res.total > 0) {
            let result = {total: res.total, items: []}
            res.items.map(item => {
                result.items.push({
                    id: item.id, 
                    name: item.name,
                    money: Number(item.price).toFixed(2),
                    score: item.score,
                    imgUrl: item.imageUrls != null ? item.imageUrls[0] : ''
                })
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
 * 获取商品详情
 * @param {*} id 
 */
const GetGoodsDetail = (id) => {
    const deferred = q.defer();
    let url = `${GetGoodsDetailUrl}/${id}`;
    httpHelper.get(url).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 兑换商品
 * @param {*} id 
 */
const RedeemGoods = (id) => {
    const deferred = q.defer();
    let url = `${RedeemGoodsUrl}/${id}`;
    httpHelper.post(url).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 获取兑换记录
 * @param {*} id 
 */
const GetGoodsRedeemRecord = (id) => {
    const deferred = q.defer();
    let url = `${GetGoodsRedeemRecordUrl}/${id}`;
    httpHelper.get(url, {}, {isLoading: false}).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    GetMallList,
    GetGoodsDetail,
    RedeemGoods,
    GetGoodsRedeemRecord
}


