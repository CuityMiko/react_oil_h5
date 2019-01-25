import React, { Component } from 'react';
import { WingBlank } from 'antd-mobile';
import {connect} from "react-redux";

import CouponComponent from "@/common/components/coupon_component/CouponComponent";
import LoginForm from '@/common/components/login_form/LoginForm';
import { GetMerchantInfoAction, GetUserLoginInfoAction } from '@/base/redux/actions';
import station_name_before from '@/share/assets/images/station_name_before.png';
import station_name_after from '@/share/assets/images/station_name_after.png';
import { getWXCode } from '@/base/utils/index';
import BusinessService from '@/common/services/business/business.service';
import couponService from '@/coupon/services/coupon.service';
import LoginService from '@/login/services/login.service';

class ShareCoupon extends Component {
    state = {
        couponNumber: '', // 卡券编号
        merchantId: 0, // 商户ID
        couponItem: {}
    };

    componentWillMount() {
        const {params, query} = this.props;
        let couponNumber = query.couponNumber || params.couponNumber;
        let merchantId = query.merchantId;
        if(couponNumber && merchantId) {
            this.setState({
                couponNumber,
                merchantId
            }, () => {
                this.findCouponFun(couponNumber);
                this.judgeIsMember();
            });
        }
    }

    // 判断是否是会员
    judgeIsMember = () => {
        const {GetMerchantInfoAction, history, query} = this.props;
        let {couponNumber, merchantId} = this.state;
        let code = '';
        let _this = this;
        let result_code = getWXCode('shareCoupon');
        sessionStorage.removeItem('shareCoupon');
        if (result_code != 1 && result_code != 0) {
            if (result_code != 2) {
                code = result_code;
            } else {
                if (query.code) {
                    code = query.code;
                }
            }
        } else {
            if (result_code == 0) {
                if (query.code) {
                    code = query.code;
                }
            }
        }
        // 缓存商户信息状态
        GetMerchantInfoAction(merchantId);
        BusinessService.JudgeIsMember({
            code,
            merchantId
        }).then(res => {
            if (res != null) {
                if (res.isMember) { // 会员
                    history.push(`/app/coupon/detail/${couponNumber}`)
                } else { // 非会员
                    _this.tryLogin(code, merchantId);
                }
            }
        })
    };

    // 获取卡券详情（用于二维码推广）
    findCouponFun = (couponNumber) => {
        couponService.findCoupon(couponNumber)
            .then((res) => {
                this.setState({
                    couponItem: res
                })
            })
            .catch((err) => {
                console.log(err);
            })
    };

    /**
     * 尝试登录
     */
    tryLogin = (code, merchantid) => {
        const {GetUserLoginInfoAction, history} = this.props;
        const {couponNumber} = this.state
        LoginService.PreLogin(code, merchantid).then(res => {
            try {
                const path = `/app/coupon/detail/${couponNumber}`;
                if (res.isLogin) { // 已登录
                    // 将登录的用户信息写入状态中
                    GetUserLoginInfoAction(res);
                    if (res.activatedCards == null || res.activatedCards.length <= 0) { // 未激活油卡
                        // 设置跳转路由
                        sessionStorage.setItem('JumpRoute', path);
                        history.push('/app/oilcard/activation?flag=login');
                    } else {
                        history.push(path);
                    }
                } else { // 未登录（手机号验证码登录）
                    sessionStorage.setItem('JumpRoute', path);
                    sessionStorage.setItem('userInfoToken', res.userInfoToken);
                }
            } catch (error) {
            }
        }).catch(err => {
        })
    }

    // 跳转首页
    goHome = () => {
        this.judgeRedirect('/app/home');
    };

    render() {
        const {couponItem} = this.state;
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
                        <div className="form-box">
                            <LoginForm useScene="share" title="登录领取到卡包" />
                            <div className="go-member-center" onClick={this.goHome}>去会员中心</div>
                        </div>
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