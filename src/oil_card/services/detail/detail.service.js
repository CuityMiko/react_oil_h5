/**
 * 我的油卡服务
 */

import q from 'q';
import httpHelper from '@/base/axios/http_helper';
import {GetCardDetailUrl, GetCardDetailAmountUrl, findMbrHasCardUrl, GetCardSpecProsUrl} from './detail.url';

/**
 * 获取每个卡种的信息（余额）以及相关的SKU
 * @param {*} cardid 卡种ID
 */
const GetCardDetail = (cardid) => {
    const deferred = q.defer();
    let url = `${GetCardDetailUrl}/${cardid}`;
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
 * 获取单个卡种下的目录商品
 * @param {*} specId 卡种ID
 */
const GetCardSpecPros = (specId) => {
    const deferred = q.defer();
    let url = `${GetCardSpecProsUrl}/${specId}`;
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
 * 获取用户所拥有的会员卡
 */
const findMbrHasCard = () => {
    const deferred = q.defer();
    httpHelper.get(findMbrHasCardUrl)
        .then((res) => {
            deferred.resolve(res);
        })
        .catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

/**
 * 获取每个卡片的消费统计
 * @param {*} cardid 会员卡ID
 */
const GetCardDetailAmount = (cardid) => {
    const deferred = q.defer();
    let url = `${GetCardDetailAmountUrl}/${cardid}`;
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
    GetCardDetail,
    GetCardSpecPros,
    findMbrHasCard,
    GetCardDetailAmount
}