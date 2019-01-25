import q from 'q';
import httpHelper from '@/base/axios/http_helper';

import memberCardUrl from './member_card.url';

const getMemberCardDetail = function (merchantId) {
    let deferred = q.defer();

    httpHelper.get(memberCardUrl.getMemberCardDetailUrl + '/' + merchantId)
        .then((res) => {
            let _res = new Map().set('特权说明', res.cardPrivilegeExplain)
                .set('有效日期', '永久有效')
                .set('商家电话', res.contactNumber)
                .set('使用须知', res.cardUseNotice);

            deferred.resolve(_res);
        })
        .catch((err) => {
            deferred.reject(err);
        });

    return deferred.promise;
};

export default {
    getMemberCardDetail
}