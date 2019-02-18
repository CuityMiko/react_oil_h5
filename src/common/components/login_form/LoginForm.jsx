/*
 * LoginForm组件：用于登录时的表单验证
 *
 * 1. useScene：使用场景，该组件在登录时或者是在分享时登录用
 *              - 默认值为login,样式为白底黑字
 *              - 可选为share,选为share时样式会发生变化，样式为透明底白字
 * 2. title: button的文字，必填
 * 3. history
 * 4. couponNumber: 用于分享卡券登录场景时使用
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import { InputItem, List, Button, Toast, WhiteSpace } from 'antd-mobile';
import classnames from 'classnames';
import {connect} from 'react-redux';

import MobileButton from '@/common/components/mobile_button/MobileButton';
import CommonService from '@/common/services/common/common.service';
import { GetUserLoginInfoAction } from '@/base/redux/actions';
import LoginService from "@/login/services/login.service";

class LoginForm extends Component {
    constructor() {
        super()
        this.codetimer = 0;
    }
    static propTypes = {
        useScene: PropTypes.oneOf(['login', 'share']),
        title: PropTypes.string.isRequired,
        history: PropTypes.object,
        couponNumber: PropTypes.string
    };

    static defaultProps = {
        useScene: 'login'
    };

    state = {
        time: 60,
        isSend: false
    };

    /**
     * 获取验证码
     */
    sendCode = () => {
        const { getFieldValue } = this.props.form;
        const mobile = getFieldValue('mobile');
        if (this.validateMobile(mobile)) {
            CommonService.SendCode(mobile.replace(/\s/g, '')).then(res => {
                Toast.success('验证码发送成功!', 1, () => {
                    // CommonService.GetSendCode(mobile.replace(/\s/g, '')).then(res2 => {Toast.info(`验证码为：${res2}`, 3)})
                });
                this.setState({isSend: true});
                this.countdown();
            })
        }
    };

    /**
     * 验证手机号
     */
    validateMobile = (mobile) => {
        if (mobile == undefined) {
            Toast.info('手机号不能为空', 2);
            return false;
        }
        const mobileReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (!mobileReg.test(mobile.replace(/\s/g, ''))) {
            Toast.info('手机号格式不正确', 2);
            return false;
        }
        return true;
    };

    componentWillUnmount() {
        clearInterval(this.codetimer);
    }

    /**
     * 倒计时
     */
    countdown() {
        const _self = this;
        let {time} = _self.state;
        this.codetimer = setInterval(() => {
            if (time > 0) {
                time = time - 1;
                _self.setState({time});
            } else {
                clearInterval(this.codetimer);
                _self.setState({isSend: false, time: 60});
            }
        }, 1000)
    }

    /**
     * 立即领取
     */
    Login = (e) => {
        const { MerchantInfo, GetUserLoginInfoAction } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!this.validateMobile(values.mobile)) {
                return;
            }
            if (values.code == undefined) {
                Toast.info('验证码不能为空', 2);
                return;
            }
            Toast.loading('登录中...', 100);
            LoginService.Login({
                mobile: values.mobile.replace(/\s/g, ''),
                code: values.code,
                merchantId: MerchantInfo ? MerchantInfo.id : 0,
                wxInfoToken: sessionStorage.getItem('userInfoToken') || ''
            }).then(res => {
                // 将登录信息保存到状态管理中
                GetUserLoginInfoAction(res);
                this.judgeRedirect(res.activatedCards);
            })
        });
    };

    /**
     * 判断跳转
     */
    judgeRedirect = (activatedCards) => {
        const { history, useScene } = this.props;
        // // 分享表单场景
        // if (useScene === 'share') {
        //     history.push(`/app/share/share_coupon?couponNumber=${couponNumber}`);
        // }
        if (activatedCards == null || activatedCards.length <= 0) { // 未激活油卡
            history.push('/app/oilcard/activation?flag=login');
        } else {
            if (sessionStorage.getItem('JumpRoute')) { // 自动路由跳转
                const JumpRoute = sessionStorage.getItem('JumpRoute');
                sessionStorage.removeItem('JumpRoute');
                history.push(JumpRoute);
            } else { // 跳转首页
                history.push('/app/home');
            }
        }
    };

    // 修复ios收起键盘后键盘区域显示空白问题
    onBlur = () => {
        const {inputXY} = this.props;
        if (inputXY) {
            window.scroll(inputXY.data.x, inputXY.data.y);
        } else {
            window.scroll(0, 0);
        }
    };

    render() {
        const {
            useScene,
            title,
            form
        } = this.props;

        const {
            time, isSend
        } = this.state;

        const { getFieldProps } = form;

        const containerClass = classnames('login-form-container', {
            'share-form-container': useScene === 'share'
        });

        const codeBtn = isSend ? <span className="time">{`${time}s`}</span> : (<Button className="send-code-btn" size="small" type="primary" inline onClick={this.sendCode}>获取验证码</Button>);

        return (
            <div className={containerClass}>
                <List>
                    <InputItem
                        {...getFieldProps('mobile')}
                        type="phone"
                        placeholder="请输入您的手机号"
                        clear
                    >手机号</InputItem>
                    <InputItem
                        {...getFieldProps('code')}
                        type="number"
                        placeholder="请输入验证码"
                        clear onBlur={this.onBlur}
                        maxLength={6}
                        extra={codeBtn}
                    >验证码</InputItem>
                </List>
                {
                    useScene === 'share' ? ('') : (<WhiteSpace size="sm" />)
                }
                <WhiteSpace size="sm" />
                <MobileButton text={title} handleClick={this.Login} buttonClass="longButton" customClass="share-button" />
            </div>
        )
    }
}

export default connect(state => {
    const MerchantInfo = state.MerchantInfo;
    const inputXY = state.AppData.inputXY;
    return {
        MerchantInfo,
        inputXY
    }
}, {GetUserLoginInfoAction})(createForm()(LoginForm));