import q from 'q';
import httpHelper from '@/base/axios/http_helper';

import activationUrl from './activation.url';

const activationCard = function (data) {
    let deferred = q.defer();
    httpHelper.post(activationUrl.activationCardUrl, data)
        .then((res) => {
            deferred.resolve(res);
        })
        .catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
};

/**
 * 获取卡片列表
 */
const getCardList = () => {
    const deferred = q.defer();
    httpHelper.get(activationUrl.getCardListUrl)
        .then((res) => {
            deferred.resolve(res);
        })
        .catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

export default {
    activationCard,
    getCardList
};