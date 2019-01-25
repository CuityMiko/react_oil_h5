import React, { Component } from 'react';
import { WingBlank } from 'antd-mobile';
import {connect} from "react-redux";

import CouponComponent from "@/common/components/coupon_component/CouponComponent";
import MobileButton from '@/common/components/mobile_button/MobileButton';
import LoginForm from '@/common/components/login_form/LoginForm';
import { GetMerchantInfoAction, GetUserLoginInfoAction } from '@/base/redux/actions';

import station_name_before from '@/share/assets/images/station_name_before.png';
import station_name_after from '@/share/assets/images/station_name_after.png';
import no_coupon_icon from '@/share/assets/images/no_coupon_icon.png';
import get_success_icon from '@/share/assets/images/get_success_icon.png';

import { getWXCode } from '@/base/utils/index';
import BusinessService from '@/common/services/business/business.service';
import shareService from '@/share/services/share.service';
import CouponService from '@/coupon/services/coupon.service';
import LoginService from '@/login/services/login.service';

class ShareCoupon extends Component {
    state = {
        couponNumber: '',
        // 卡券id
        id: 0,
        couponItem: {},
        // 假设1-未领取卡券，显示表单 2-优惠券领取成功  3-卡券已被抢完  4-已领取过卡券
        type: 0,
        activatedCards: [] // 当前用户激活的油卡
    };

    componentDidMount() {
        const {params, query} = this.props;
        let couponNumber = params.couponNumber || query.couponNumber;
        if(couponNumber) {
            this.setState({
                couponNumber
            });
            this.findCouponFun(couponNumber);
            this.judgeIsMember(couponNumber);
        }
    }

    // 判断是否是会员
    judgeIsMember = () => {
        const {MemberInfo, MerchantInfo, GetMerchantInfoAction} = this.props;
        let code = '';
        let merchantId = 0;
        let _this = this;
        if (MemberInfo && MerchantInfo) { // 登录
            code = '';
            merchantId = MerchantInfo.id;
        } else { // 未登录
            let result_code = getWXCode('shareCoupon');
            sessionStorage.removeItem('shareCoupon');
            if (result_code != 1 && result_code != 0) {
                if (result_code) {
                    code = result_code;
                } else {
                    if (query.code) {
                        code = query.code;
                    }
                }
                merchantId = this.props.query.merchantId;
                GetMerchantInfoAction(merchantId);
            }
        }
        BusinessService.JudgeIsMember({
            code,
            merchantId
        }).then(res => {
            if (res != null) {
                if (res.isMember) { // 会员
                    _this.getCoupon();
                } else { // 非会员
                    _this.tryLogin(code, merchantId);
                }
            }
        })
    };

    // 获取卡券详情（用于二维码推广）
    findCouponFun = (couponNumber) => {
        shareService.findCoupon(couponNumber)
            .then((res) => {
                this.setState({
                    couponItem: res,
                    id: res.id
                })
            })
            .catch((err) => {
                console.log(err);
            })
    };

    // 领取卡券
    getCoupon = () => {
        const { id } = this.state;
        CouponService.TakeCoupon(id)
            .then(res => {
                this.setState({
                    type: 2
                })
            })
            .catch((err) => {
                if(err === '会员领取上限，不允许领取') {
                    this.setState({
                        type: 4
                    })
                } else if (err === '卡券已被领取完') {
                    this.setState({
                        type: 3
                    })
                }
            })
    };

    /**
     * 尝试登录
     */
    tryLogin = (code, merchantid) => {
        const {GetUserLoginInfoAction} = this.props;
        LoginService.PreLogin(code, merchantid).then(res => {
            try {
                if (res.isLogin) { // 已登录
                    // 将登录的用户信息写入状态中
                    GetUserLoginInfoAction(res);
                    this.setState({activatedCards: res.activatedCards}, () => {
                        this.getCoupon();
                    })
                } else { // 未登录（手机号验证码登录）
                    this.setState({
                        type: 1
                    })
                    sessionStorage.setItem('userInfoToken', res.userInfoToken);
                }
            } catch (error) {
            }
        }).catch(err => {
        })
    }

    /**
     * 判断跳转
     */
    judgeRedirect = (path) => {
        const {activatedCards} = this.state;
        const {history} = this.props;
        if (activatedCards == null || activatedCards.length <= 0) { // 未激活油卡
            history.push('/app/oilcard/activation?flag=login');
        } else {
            history.push(path);
        }
    }

    // 跳转首页
    goHome = () => {
      this.judgeRedirect('/app/home');
    };

    // 判断分享下方的显示
    judge = (type) => {
        const { couponNumber } = this.state;

        let mobile = '';
        let phone = '';
        // 处理手机号
        if(this.props.MemberInfo) {
            mobile = this.props.MemberInfo.mobile;
            const str1 = mobile.slice(0, 3);
            const str2 = mobile.slice(7, 11);
            phone = str1.concat(' **** ').concat(str2);
        }

        switch (type) {
            case 1:
                return (
                    <div className="form-box">
                        <LoginForm useScene="share" title="登录领取到卡包" couponNumber={couponNumber} />
                        <div className="go-member-center" onClick={this.goHome}>去会员中心</div>
                    </div>
                );
            case 2:
                return (
                    <div className="text-box">
                        <img src={get_success_icon} alt="" />
                        <div className="title">优惠券领取成功</div>
                        <div className="sub-title">已放置您的<span>{mobile}</span>会员卡包</div>
                        <MobileButton text="去看看" customClass="share-button" buttonClass="longButton" handleClick={this.goHome} />
                    </div>
                );
            case 3:
                return (
                    <div className="text-box">
                        <img src={no_coupon_icon} alt="" />
                        <div className="title">您好，{phone}</div>
                        <div className="sub-title">来晚了一步，卡券已经被抢完了！</div>
                        <MobileButton text="去会员中心领取更多" customClass="share-button" buttonClass="longButton" handleClick={this.goHome} />
                    </div>
                );
            case 4:
                return (
                    <div className="text-box">
                        <img src={get_success_icon} alt="" />
                        <div className="title">您已领取过该卡券</div>
                        <div className="sub-title">已放置您的<span>{mobile}</span>会员卡包</div>
                        <MobileButton text="去看看" customClass="share-button" buttonClass="longButton" handleClick={this.goHome} />
                    </div>
                );
            default:
                break;
        }
    };

    render() {
        const {
            couponItem,
            type
        } = this.state;
        const {MerchantInfo} = this.props;
        return (
            <div className="share-coupon-container">
                <div className="content">
                    <div className="station-name-box">
                        <img className="station-name-before" src={station_name_before} alt="" />
                        <div className="station-name">{MerchantInfo && MerchantInfo.name ? MerchantInfo.name : ''}</div>
                        <img className="station-name-after" src={station_name_after} alt="" />
                    </div>
                    <WingBlank size="md">
                        <CouponComponent useScene="share-coupon" customClass="share-coupon-class" couponItem={couponItem} />
                        {this.judge(type)}
                    </WingBlank>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    MerchantInfo: state.MerchantInfo,
    MemberInfo: state.MemberInfo
}), {GetMerchantInfoAction, GetUserLoginInfoAction})(ShareCoupon);