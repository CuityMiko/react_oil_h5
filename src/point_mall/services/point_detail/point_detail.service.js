/**
 * 积分明细服务
 */

import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {GetPointInformationUrl, GetPointDetailListUrl, GetPointDetailUrl} from './point_detail.url';

/**
 * 获取积分规则
 * @param {*} cardid 
 */
const GetPointInfoOfCard = (cardid) => {
    const deferred = q.defer();
    httpHelper.get(GetPointInformationUrl, {cardSpecId: cardid}).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 积分须知
 */
const GetPointInformation = async () => {
    const deferred = q.defer();
    const result = await Promise.all([GetPointInfoOfCard(1), GetPointInfoOfCard(2)]);
    deferred.resolve(result);
    return deferred.promise;
}

/**
 * 获取积分明细列表
 * @param {*} type 0积分累计(消费累积) 1积分兑换 2充值赠送 3退款扣除 4.开卡注册; 
 * 0/2/4:增加、1/3减少
 */
const GetPointDetail = (type) => {
    const deferred = q.defer();
    httpHelper.get(GetPointDetailListUrl, {type}).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 获取积分明细列表
 * @param {*} flag 0: 全部 1: 增加 2: 减少
 */
const GetPointDetailList0 = async (flag) => {
    const deferred = q.defer();
    try {
        switch (flag) {
            case 0:
                const result0 = await Promise.all([
                    GetPointDetail(0), 
                    GetPointDetail(1),
                    GetPointDetail(2),
                    GetPointDetail(3),
                    GetPointDetail(4),
                    GetPointDetail(5),
                    GetPointDetail(6),
                    GetPointDetail(7)
                ]);
                deferred.resolve(result0);
                break;
            case 1:
                const result1 = await Promise.all([
                    GetPointDetail(0), 
                    GetPointDetail(2),
                    GetPointDetail(4),
                    GetPointDetail(5),
                    GetPointDetail(7)
                ]);
                deferred.resolve(result1);
                break;
            case 2:
                const result2 = await Promise.all([ 
                    GetPointDetail(1),
                    GetPointDetail(3),
                    GetPointDetail(6)
                ]);
                deferred.resolve(result2);
                break;
            default:
                break;
        }
    } catch (error) {
        deferred.reject('error');
    }
    return deferred.promise;
}

/**
 * 获取积分明细列表
 * @param {*} flag 0: 全部 1: 增加 2: 减少
 */
const GetPointDetailList = (flag) => {
    switch (flag) {
        case 0:
            return GetPointDetail([0, 1, 2, 3, 4, 5, 6, 7].toString());
        case 1:
            return GetPointDetail([0, 2, 4, 5, 7].toString());
        case 2:
            return GetPointDetail([1, 3, 6].toString());
        default:
            return GetPointDetail([0, 1, 2, 3, 4, 5, 6, 7].toString());
    }
}

/**
 * 获取积分明细详情
 * @param {*} id 
 */
const GetPointDetailInfo = (id) => {
    const deferred = q.defer();
    let url = `${GetPointDetailUrl}/${id}`;
    httpHelper.get(url).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    GetPointInfoOfCard,
    GetPointInformation,
    GetPointDetail,
    GetPointDetailList,
    GetPointDetailInfo
}