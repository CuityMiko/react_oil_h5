/**
 * 油卡 Reducers
 */

// 油卡激活
import ActivationReducers from './containers/activation/redux/reducers';

// 我的油卡
import DetailReducers from './containers/detail/redux/reducers';

export default {
    ...ActivationReducers,
    ...DetailReducers
}