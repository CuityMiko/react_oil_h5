import React, { Component } from 'react';
import { WingBlank, WhiteSpace } from 'antd-mobile';
import {connect} from 'react-redux';
import moment from 'moment';

import Field from '@/common/components/field/Field';
import CouponComponent from "@/common/components/coupon_component/CouponComponent";
import MobileButton from '@/common/components/mobile_button/MobileButton';
import pay_success from '@/payment/assets/images/pay_success.png';
import get_icon from '@/payment/assets/images/get_icon.png';
import PaymentService from '@/payment/services/payment.services';
import {GetMemberInfoAction} from '@/base/redux/actions';

import './pay_success.less';

class PaySuccess extends Component {
    state = {
        isMember: false,
        couponItem: null,
        orderAmount: 0, // 订单金额
        payAmount: 0, // 支付金额
        discountAmount: 0 // 优惠金额
    };

    componentWillMount() {
        // 绑定支付结果
        setTimeout(() => {
            this.bindPayResult();
            // 更新用户状态
            const {MemberInfo, GetMemberInfoAction} = this.props;
            if (MemberInfo) {
                GetMemberInfoAction();
            }
        }, 200)
    }

    /**
     * 绑定支付结果
     */
    bindPayResult = () => {
        const {result, isMember} = this.props.query;
        if (result != undefined) {
            const payResult = JSON.parse(decodeURIComponent(result));
            this.setState({
                isMember,
                orderAmount: parseFloat(payResult.orderAmount).toFixed(2),
                payAmount: parseFloat(payResult.realPayAmount).toFixed(2),
                discountAmount: parseFloat(payResult.discountAmount).toFixed(2)
            })
            // 绑定优惠券
            this.bindCoupon(payResult.orderNumber);
        } else {
            const {orderAmount, realPayAmount, discountAmount, orderNumber, mbrId} = this.props.query;
            this.setState({
                isMember: mbrId != undefined && mbrId != null && mbrId != '' ? true : false,
                orderAmount: parseFloat(orderAmount).toFixed(2),
                payAmount: parseFloat(realPayAmount).toFixed(2),
                discountAmount: parseFloat(discountAmount).toFixed(2)
            })
            // 绑定优惠券
            this.bindCoupon(orderNumber);
        }
    }

    /**
     * 绑定优惠券
     */
    bindCoupon = (orderNumber) => {
        PaymentService.GetAfterPayCoupon(orderNumber).then(res => {
            if (res != null && res.coupon) {
                let couponItem = {
                    cnum: res.coupon.couponNumber,
                    amount: res.coupon.amount,
                    leastCost: res.coupon.leastCost,
                    name: res.coupon.name,
                    applyGoods: res.coupon.skuName,
                    availInventory: 0, //可用库存
                    actTimeStart: res.coupon.actTimeStart,
                    actTimeEnd: res.coupon.actTimeEnd,
                    date: ''
                }
                // dateType 卡券使用有效期类型 0-固定时间 1-立即生效
                if(res.coupon.dateType == 0) {
                    couponItem.date = `${moment(res.coupon.actTimeStart).format('MM.DD')} - ${moment(res.coupon.actTimeEnd).format('MM.DD')}`;
                } else if(res.coupon.dateType == 1) {
                    couponItem.date = `${moment().format('MM.DD')} - ${moment().add(res.coupon.fixedTerm - 1, 'days').format('MM.DD')}`;
                }
                this.setState({couponItem})
            }
        })
    }

    /**
     * 非会员先注册然后再登录
     */
    goToLogin = (url) => {
        this.props.history.push(url);
    }

    // 判断下方是送会员还是送卡券，目前只存在这两种情况，后期有需要可进行扩展
    judge = () => {
        const {isMember, couponItem} = this.state;
        const {MerchantInfo} = this.props;
        if (couponItem != null) {
            return (
                <div className="gift-coupon">
                    <div className="gift-coupon-title">恭喜！老板送您1张优惠券</div>
                    <CouponComponent useScene="gift-coupon" couponItem={couponItem}>
                        <MobileButton text="去看看" buttonClass="shortButton" customClass="gift-coupon-button" handleClick={() => {this.props.history.push(`/app/coupon/detail/${couponItem.cnum}`)}} />
                    </CouponComponent>
                </div>
            )
        } else {
            if (!isMember) { // 非会员
                return (
                    <div className="gift-member" onClick={() => {this.goToLogin(`/app/login/${MerchantInfo.id || 0}`)}} >
                        <div className="box">
                            <div className="station-name">{MerchantInfo ? MerchantInfo.name : ''}</div>
                            <img className="get-icon" src={get_icon} alt=""/>
                        </div>
                    </div>
                );
            } else {
                return null;
            }
        }
    };

    /**
     * 返回首页
     */
    goHome = () => {
        this.props.history.push('/app/home');
    }

    render() {
        const {orderAmount, payAmount, discountAmount} = this.state;
        return (
            <div className="pay-success-container">
                <div className="header">
                    <img className="icon" src={pay_success} alt="" />
                    <div className="title">付款成功</div>
                    <div className="amount">¥{payAmount}</div>
                </div>
                <WingBlank size="sm">
                    <Field text="消费金额" customClass="field-class">
                        <span>¥{orderAmount}</span>
                    </Field>
                    <Field text="优惠金额" customClass="field-class">
                        <span>¥{discountAmount}</span>
                    </Field>
                    <div className="line"></div>
                    {this.judge()}
                    <WhiteSpace size="lg"/>
                    <WingBlank size="md">
                        <MobileButton text="回到首页" handleClick={this.goHome} buttonClass="longButton" />
                    </WingBlank>
                </WingBlank>
            </div>
        )
    }
}

export default connect(state => ({
    MemberInfo: state.MemberInfo,
    MerchantInfo: state.MerchantInfo    
}), {GetMemberInfoAction})(PaySuccess);