import React from 'react';
import { connect } from 'react-redux';
import { 
    WhiteSpace, WingBlank, Toast, Icon, ActivityIndicator, Modal
} from 'antd-mobile';

import Card from '@/common/components/card/Card';
import Field from '@/common/components/field/Field';
import MobileButton from '@/common/components/mobile_button/MobileButton';
import { receiveData, GetMerchantInfoAction, GetUserLoginInfoAction } from '@/base/redux/actions';
import quanyi_img from './assets/images/quanyi.png';
import LoginForm from '@/common/components/login_form/LoginForm';
import LoginService from './services/login.service';
import {getWXCode} from '@/base/utils/index';

const alert = Modal.alert;

class Login extends React.Component {
    state = {
        disabled: false,
        entryRequest: true,
        issuccess: false
    }

    componentWillMount() {
        const {params} = this.props;
        const _result = getWXCode('wxcode');
        if (_result == 0) {
            // 进入入口请求
            this.bindEntry();
        } else if (_result == 1) { // 拒绝授权微信信息
            this.setState({entryRequest: false});
            alert('温馨提示', '该应用需要授权用户信息，是否授权微信信息？', [
                { text: '取消', onPress: () => {
                    try {
                        window.close();
                    } catch (error) {
                    }
                    this.setState({issuccess: false});
                } },
                { text: '确定', onPress: () => this.bindEntry() },
            ])
        } else {
            // 尝试登录
            this.tryLogin(_result, params.merchantid);
        }
    }

    /**
     * 绑定商户信息
     */
    bindMerchantInfo = () => {
        const {params, GetMerchantInfoAction, MerchantInfo} = this.props;
        if (params && params.merchantid) {
            GetMerchantInfoAction(params.merchantid);
        } else {
            const merchantinfo_store = sessionStorage.getItem('merchantinfo');
            if (merchantinfo_store) {
                if (MerchantInfo == null) {
                    const merchantinfo_obj = JSON.parse(merchantinfo_store);
                    GetMerchantInfoAction(merchantinfo_obj.id);
                }
            }
        }
        this.setState({entryRequest: false, issuccess: true})
    }

    /**
     * 尝试登录
     */
    tryLogin = (code, merchantid) => {
        const {GetUserLoginInfoAction} = this.props;
        if (sessionStorage.getItem('wxcode') == null || JSON.parse(sessionStorage.getItem('wxcode')).isfirst) {
            LoginService.PreLogin(code, merchantid).then(res => {
                try {
                    if (res.isLogin) { // 已登录
                        // 将登录的用户信息写入状态中
                        GetUserLoginInfoAction(res);
                        this.judgeRedirect(res.activatedCards);
                    } else { // 未登录（手机号验证码登录）
                        this.setState({
                            entryRequest: false,
                            issuccess: true
                        })
                        sessionStorage.setItem('userInfoToken', res.userInfoToken);
                        // 绑定商户信息
                        this.bindMerchantInfo();
                    }
                } catch (error) {
                    Toast.fail(error, 2);
                }
            }).catch(err => {
                this.setState({entryRequest: false, issuccess: true});
            })
        } else {
            this.setState({
                entryRequest: false,
                issuccess: true
            })
        }
    }

    /**
     * 判断跳转
     */
    judgeRedirect = (activatedCards) => {
        const {history} = this.props;
        // 绑定商户信息
        this.bindMerchantInfo();
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
    }

    /**
     * 绑定入口
     */
    bindEntry = () => {
        const {params, GetUserLoginInfoAction} = this.props;
        if (params && params.merchantid) {
            LoginService.Entry(params.merchantid).then(res => {
                const result = res;
                if (result) {
                    switch (result.status) {
                        case 1: // 已登录
                            // 将登录的用户信息写入状态中
                            GetUserLoginInfoAction(result)
                            this.judgeRedirect(result.activatedCards);
                            break;
                        case 2: // 未登录
                            window.location.href = result.redirectUrl;
                            break;
                        case 3: // 非微信浏览器
                            // 绑定商户信息
                            this.bindMerchantInfo();
                            break;
                        default:
                            break;
                    }
                }
            }).catch(err => {
                Toast.fail(err, 2, () => {
                    this.setState({entryRequest: false, issuccess: true});
                });
            })
        } else {
            this.bindMerchantInfo();
        }
    }

    /**
     * 绑定卡片
     */
    bindCard = () => {
        let {MerchantInfo} = this.props;
        if (MerchantInfo == null) {
            return (<Card />);
        } else {
            let card = {
                title: MerchantInfo.name
            }
            if (MerchantInfo.logoUrl) {
                card.logo = MerchantInfo.logoUrl;
            }
            if (MerchantInfo.cardCoverType == '1') {
                card.bgImg = MerchantInfo.cardCoverChoice;
            }
            return (<Card cardObj={card} />);
        }
    }

    /**
     * 查看权益
     */
    seaQuanyi = () => {
        this.props.history.push('/app/member/card-detail');
    }

    /**
     * 查看协议
     */
    seaAgreement = () => {
        this.props.history.push('/app/member/agreement');
    }

    /**
     * 绑定初始页
     */
    bindInitPage = () => {
        const {entryRequest, issuccess} = this.state;
        if (entryRequest) {
            return (<ActivityIndicator size="large" animating={entryRequest} toast text="正在加载中....." />);
        } else {
            if (issuccess) {
                const {history} = this.props;
                return (
                    <div className="login-container">
                        <WhiteSpace size="sm" />
                        <WingBlank size="md">
                            {this.bindCard()}
                            <Field imgSrc={quanyi_img} text="权益" customClass="field-class">
                                <MobileButton text="查看会员卡详情"
                                              customClass="button-class"
                                              icon={<Icon type="right" size="xs" />}
                                              handleClick={this.seaQuanyi}
                                />
                            </Field>
                            <LoginForm title="立 即 领 取" history={history} />
                            <div className="service-agreement" onClick={this.seaAgreement}>登录即同意<span>《会员服务协议》</span></div>
                        </WingBlank>
                    </div>
                )
            } else {
                return (
                    <div className="login-container"></div>
                )
            }
        }
    }
    
    render() {
        return this.bindInitPage();
    }
}

export default connect(state => ({
    rootinfo: state.AppData.rootinfo,
    MerchantInfo: state.MerchantInfo
}), {receiveData, GetMerchantInfoAction, GetUserLoginInfoAction})(Login);