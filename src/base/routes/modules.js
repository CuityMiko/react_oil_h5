/**
 * 路由组件出口文件
 */

// 登录
import Login from '@/login/login.route'

// 首页
import Home from '@/home/home.route'

// 会员卡
import MemberCard from '@/member_card/member_card.route'

// 油卡
import OilCard from '@/oil_card/oil_card.route'

// 我的信息
import MyInfo from '@/my_info/my_info.route'

// 充值
import StoredValue from '@/stored_value/stored_value.route'

// 积分
import PointMall from '@/point_mall/point_mall.route'

// 卡券
import Coupon from '@/coupon/coupon.route'

// 支付
import Payment from '@/payment/payment.route'

// 分享
import Share from '@/share/share.route'

export default {
    ...Login.modules,
    ...Home.modules,
    ...MemberCard.modules,
    ...OilCard.modules,
    ...MyInfo.modules,
    ...StoredValue.modules,
    ...PointMall.modules,
    ...Coupon.modules,
    ...Payment.modules,
    ...Share.modules
}