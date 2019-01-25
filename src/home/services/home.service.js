import q from 'q';
import httpHelper from '@/base/axios/http_helper';
import homeUrl from './home.url';

// 获取首页数据
const getHomeData = function (params) {
    const _params = Object.assign({}, {...params});
    let deferred = q.defer();

    httpHelper.get(
        homeUrl.homeDataUrl
    ).then((res) => {
        let _res = {};

        // Card数据
        let cardObj = {};
        // 处理手机号
        const str1 = res.mobile.slice(0, 3);
        const str2 = res.mobile.slice(7, 11);
        const phone = str1.concat(' **** ').concat(str2);
        cardObj.phone = phone;
        _res.cardObj = cardObj;
        
        if (res.cards != null) {
            // dataItems数据
            let petrolCard = 0; // 汽油卡余额
            let dieselCard = 0; // 柴油卡余额
            res.cards.map((item, index) => {
                // cardSpecId，1汽油卡，2柴油卡
                if(item.cardSpecId === 1) {
                    petrolCard = item.availableAmount;
                } else if(item.cardSpecId === 2) {
                    dieselCard = item.availableAmount;
                }
                return {
                    petrolCard, dieselCard
                }
            });
            let dataItems = new Map();
            if (res.cards.length > 1) {
                let _map1 = new Map().set('汽油卡', petrolCard);
                let _map2 = new Map().set('柴油卡', dieselCard);
                dataItems.set(_map1, _params.handleClick.goPetrolStoreValueList)
                    .set(_map2, _params.handleClick.goGasStoreValueList)
            } else {
                if (res.cards[0].cardSpecId == 1) { // 汽油卡
                    let _map1 = new Map().set('汽油卡', petrolCard);
                    dataItems.set(_map1, _params.handleClick.goPetrolStoreValueList)
                } else { // 柴油卡
                    let _map2 = new Map().set('柴油卡', dieselCard);
                    dataItems.set(_map2, _params.handleClick.goGasStoreValueList)
                }
            }
            _res.cards = res.cards;
            let _map3 = new Map().set('可用积分', res.availableScore);
            let _map4 = new Map().set('优惠券', res.usableCoupons);
            dataItems.set(_map3, _params.handleClick.goPointList)
                .set(_map4, _params.handleClick.goCouponPackage);
            _res.dataItems = dataItems;
        }
        deferred.resolve(_res);
    }).catch((err) => {
        deferred.reject(err);
    });

    return deferred.promise;
};

/**
 * 获取通知
 */
const GetNotice = () => {
    let deferred = q.defer();
    httpHelper.get(homeUrl.GetNoticeUrl).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    getHomeData,
    GetNotice
}