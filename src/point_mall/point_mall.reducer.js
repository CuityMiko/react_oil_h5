/**
 * 积分商城 Reducers
 */

// 提货码
import DeliveryCodeReducers from './containers/delivery_code/redux/reducers';

// 商城
import MallReducers from './containers/mall/redux/reducers';

// 积分明细
import PointDetail from './containers/mall/redux/reducers';

export default {
    ...DeliveryCodeReducers,
    ...MallReducers,
    ...PointDetail
}