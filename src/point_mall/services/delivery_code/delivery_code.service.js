/**
 * 我的提货码服务
 */

import q from 'q';

import httpHelper from '../../../base/axios/http_helper';
import {GetDeliveryCodeListUrl} from './delivery_code.url';

/**
 * 获取我的提货码列表
 * @param {*} data status：-1:全部 0:未使用 1:已使用
 */
const GetDeliveryCodeList = (data) => {
    const deferred = q.defer();
    httpHelper.get(GetDeliveryCodeListUrl, data).then(res => {
        if (res != null && res.total > 0) {
            let result = {total: res.total, items: []}
            res.items.map(item => {
                result.items.push({
                    id: item.id, 
                    name: item.name,
                    money: item.price,
                    score: item.score,
                    imgUrl: item.imageUrl != null ? item.imageUrl[0] : ''
                })
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
    GetDeliveryCodeList
}