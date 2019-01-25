/**
 * 充值 Reducers
 */

// 快速充值
import RechargeReducers from './containers/recharge/redux/reducers';

// 充值明细
import StoredValueReducers from './containers/detail/redux/reducers';

export default {
    ...RechargeReducers,
    ...StoredValueReducers
}