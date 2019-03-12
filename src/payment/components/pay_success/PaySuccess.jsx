import React, { Component } from 'react';
import { WingBlank, WhiteSpace } from 'antd-mobile';
import {connect} from 'react-redux';
import moment from 'moment';
import * as QrCode from 'qrcode.react';
import QueueAnim from 'rc-queue-anim';

import Field from '@/common/components/field/Field';
import CouponComponent from "@/common/components/coupon_component/CouponComponent";
import MobileButton from '@/common/components/mobile_button/MobileButton';
import pay_success from '@/payment/assets/images/pay_success.png';
import get_icon from '@/payment/assets/images/get_icon.png';
import PaymentService from '@/payment/services/payment.services';
import {GetMemberInfoAction} from '@/base/redux/actions';
import wxcodeImg from '@/payment/assets/images/wxcode.png';

import './pay_success.less';

class PaySuccess extends Component {
    state = {
        isMember: false,
        couponItem: null,
        orderAmount: 0, // 订单金额
        payAmount: 0, // 支付金额
        discountAmount: 0, // 优惠金额
        merchantWXUrl: '', // 商家微信公众号链接
        couponResult: null // 获取优惠券结果
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
            // 关注微信公众号
            this.GetWXMerchant();
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
            if (res != null) {
                const couponResult = {...res};
                let couponItem = null;
                if (couponResult && couponResult.giftCoupon) {
                    couponItem = {
                        cnum: couponResult.giftCoupon.couponNumber,
                        amount: couponResult.giftCoupon.amount,
                        leastCost: couponResult.giftCoupon.leastCost,
                        name: couponResult.giftCoupon.name,
                        applyGoods: '-',
                        availInventory: couponResult.giftCoupon.availInventory, //可用库存
                        date: '-'
                    }
                    if (couponResult.giftCoupon.skus && couponResult.giftCoupon.skus.length > 0) {
                        couponItem.applyGoods = couponResult.giftCoupon.skus.filter(s=>s.skuName!=null).map(s=>s.skuName).join('/');
                    }
                    // dateType 卡券使用有效期类型 0-固定时间 1-立即生效
                    if(couponResult.giftCoupon.dateType == 0) {
                        couponItem.date = `${moment(couponResult.giftCoupon.actTimeStart).format('MM.DD')} - ${moment(couponResult.giftCoupon.actTimeEnd).format('MM.DD')}`;
                    } else if(couponResult.giftCoupon.dateType == 1) {
                        couponItem.date = `领取后${couponResult.giftCoupon.fixedTerm}天内有效`;
                    }
                }
                this.setState({couponItem, couponResult})
            }
        })
    }

    /**
     * 非会员先注册然后再登录
     */
    goToLogin = (url) => {
        window.location.href = url;
    }

    // 判断下方是送会员还是送卡券，目前只存在这两种情况，后期有需要可进行扩展
    judge = () => {
        const {isMember, couponItem, couponResult} = this.state;
        const {MerchantInfo} = this.props;
        if (couponResult == null) {
            return null;
        }
        if (couponItem != null && couponResult.giftType == 1) { // couponResult.giftType赠送类型;-1:无赠送内容 0：会员卡 1:优惠券
            return (
                <div className="gift-coupon">
                    <div className="gift-coupon-title">恭喜！老板送您1张优惠券</div>
                    <CouponComponent useScene="gift-coupon" couponItem={couponItem}>
                        <MobileButton text="去看看" buttonClass="shortButton" customClass="gift-coupon-button" handleClick={() => {this.props.history.push(`/app/coupon/detail/${couponItem.cnum}?flag=paySuccess`)}} />
                    </CouponComponent>
                </div>
            )
        } else {
            if (couponResult.giftType == 0) {
                return (
                    <div className="gift-member" onClick={() => {this.goToLogin(couponResult.mbrIndexUrl)}} >
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

    /**
     * 关注商家微信公众号
     */
    GetWXMerchant = () => {
        const {MerchantInfo} = this.props;
        const _self = this;
        if (MerchantInfo) {
            PaymentService.GetWXMerchant(MerchantInfo.id).then((res) => {
                _self.setState({merchantWXUrl: res}, () => {
                    setTimeout(() => {
                        let canvas = document.getElementById('wxcode');
                        let imgurl = canvas.toDataURL("image/png");
                        _self.setState({
                            imgurl
                        })
                    }, 300)
                });
            })
        }
    }

    render() {
        const {orderAmount, payAmount, discountAmount, isMember, merchantWXUrl, imgurl} = this.state;
        return (
            <QueueAnim style={{height:'100%'}} type={['right', 'left']} delay={200} duration={1500} leaveReverse={true} forcedReplay={true}>
                <div className="pay-success-container" key="pay-success">
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
                        <WhiteSpace size="sm"/>
                        {
                            merchantWXUrl != '' && merchantWXUrl != null ?
                            <div style={{'textAlign': 'center'}}>
                                <QrCode value={merchantWXUrl} size={120} id="wxcode" style={{display: 'none'}}/>
                                {
                                    imgurl ? <div className="wxcodediv">
                                        <img className="wxcode" src={imgurl}/>
                                        <img className="wxcodeinfo" src={wxcodeImg} />
                                    </div>: null
                                }
                            </div> : null
                        }
                        <WingBlank size="md">
                            <WhiteSpace size="sm"/>
                            <MobileButton text="回到首页" handleClick={this.goHome} buttonClass="longButton" />
                            <WhiteSpace size="sm"/>
                        </WingBlank>
                    </WingBlank>
                </div>
            </QueueAnim>
        )
    }
}

export default connect(state => ({
    MemberInfo: state.MemberInfo,
    MerchantInfo: state.MerchantInfo    
}), {GetMemberInfoAction})(PaySuccess);