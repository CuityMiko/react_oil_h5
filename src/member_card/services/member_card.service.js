import q from 'q';
import httpHelper from '@/base/axios/http_helper';

import memberCardUrl from './member_card.url';

const getMemberCardDetail = function (merchantId) {
    let deferred = q.defer();

    httpHelper.get(memberCardUrl.getMemberCardDetailUrl + '/' + merchantId)
        .then((res) => {
            let _cardPrivilegeExplain = res.cardPrivilegeExplain.replace(/\n/g, '<br/>');
            let _cardUseNotice = res.cardUseNotice.replace(/\n/g, '<br/>');
            let _res = new Map().set('特权说明', _cardPrivilegeExplain)
                .set('有效日期', '永久有效')
                .set('商家电话', res.contactNumber)
                .set('使用须知', _cardUseNotice);

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