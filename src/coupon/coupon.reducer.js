/**
 * 卡券 Reducers
 */

// 卡券广场
import CouponSquareReducers from './containers/coupon_square/redux/reducers';

// 我的卡包
import CouponPackageReducers from './containers/coupon_package/redux/reducers';

export default {
    ...CouponSquareReducers,
    ...CouponPackageReducers
}