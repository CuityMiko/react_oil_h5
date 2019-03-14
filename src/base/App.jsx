import React, { Component } from 'react';
import { connect } from 'react-redux';

import { receiveData, GetMerchantInfoAction, GetUserLoginInfoAction, GetMemberInfoAction } from '@/base/redux/actions';
import Routers from '@/base/routes/router';
import {get} from '../base/utils/cookie';

class App extends Component {
    state = {
        collapsed: false,
        width: 0,
        height: 0
    };

    componentWillMount() {
        // 绑定商户信息
        this.bindMerchantInfo();
        // 绑定用户信息
        this.bindUserInfo();
        // 绑定会员信息
        this.bindMemberInfo();
        this.getClientWidth();
        window.onresize = () => {
            this.getClientWidth();
        }
        // 获取鼠标点击位置
        document.onmousemove = this.mousePosition;
        // 禁止下拉
        // this.bindTouchMove();
    }

    bindTouchMove = () => {
        if (window.location.hash.indexOf('/app/payment') <= -1) {
            document.querySelector('.scroll').addEventListener('touchstart', function() {
                if (window.location.hash.indexOf('/app/payment') <= -1) {
                    var top = document.querySelector('.scroll').scrollTop
                    , totalScroll = document.querySelector('.scroll').scrollHeight
                    , currentScroll = top + document.querySelector('.scroll').offsetHeight
                    if(top === 0) {
                        document.querySelector('.scroll').scrollTop = 1
                    } else if(currentScroll === totalScroll) {
                        document.querySelector('.scroll').scrollTop = top - 1
                    }
                }
            })
            try {
                document.querySelector('.scroll').addEventListener('touchmove', function(evt) {
                    if (window.location.hash.indexOf('/app/payment') <= -1) {
                        if(document.querySelector('.scroll').offsetHeight < document.querySelector('.scroll').scrollHeight) {
                            evt._isScroller = true
                        }
                    }
                })
                document.getElementsByTagName("body")[0].addEventListener("touchmove", function(e) {
                    if (window.location.hash.indexOf('/app/payment') <= -1) {
                        if(!e._isScroller) {
                            e.preventDefault()
                        }
                    }
                }, { passive: false });
            } catch (error) {
            }
        }
    }

    // 获取鼠标点击位置
    mousePosition = (e) => {
        e = e || window.event;
        let x = 0;
        let y = 0;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY
        } else {
            x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
            y = e.clientY + document.body.scrollTop - document.body.clientTop
        }
        const {receiveData} = this.props;
        // 获取Input焦点相对位置
        receiveData({x, y}, 'inputXY');
    };
    

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
                const merchantinfo_obj = JSON.parse(merchantinfo_store);
                GetMerchantInfoAction(merchantinfo_obj.id);
            } else {
                const wxmerchantId = sessionStorage.getItem('wxmerchantId');
                if (wxmerchantId) {
                    GetMerchantInfoAction(parseInt(wxmerchantId));
                } else {
                    // 从cookie中获取商户ID
                    let _merchantid = get('merchantId');
                    if (_merchantid) {
                        GetMerchantInfoAction(_merchantid);
                    }
                }
            }
        }
    }

    /**
     * 绑定用户信息
     */
    bindUserInfo = () => {
        const {GetUserLoginInfoAction, UserLoginInfo} = this.props;
        const userlogininfo_store = sessionStorage.getItem('userlogininfo');
        if (userlogininfo_store) {
            if (UserLoginInfo == null) {
                const userlogininfo_obj = JSON.parse(userlogininfo_store);
                GetUserLoginInfoAction(userlogininfo_obj);
            }
        }
    }

    //判断是否是微信浏览器/是否是ios的函数
    judge = () => {
        let ua = window.navigator.userAgent.toLowerCase();
        return {
            isWechat: ua.match(/MicroMessenger/i) == 'micromessenger',
            isIOS: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        }
    };

    /**
     * 绑定会员信息
     */
    bindMemberInfo = () => {
        const {GetMemberInfoAction, MemberInfo} = this.props;
        const memberinfo_store = sessionStorage.getItem('memberinfo');
        if (memberinfo_store) {
            if (MemberInfo == null) {
                GetMemberInfoAction();
            }
        }
    }

    // 响应式
    getClientWidth = () => {
        const {receiveData} = this.props;
        // 获取当前屏幕大小
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.setState({width, height});
        let res = this.judge();
        // 是否是微信
        receiveData({isWechat: res.isWechat, isIOS: res.isIOS}, 'rootinfo');
    };
    
    render() {
        const { width, height } = this.state;
        return (
            <div style={{width, height}} key="app">
                <Routers history={this.props.history}/>
            </div>
        );
    }
}

export default connect(state => {
    const { rootinfo = {data: {}}, inputXY = {data: {}} } = state.AppData;
    return {
        rootinfo,
        MerchantInfo: state.MerchantInfo,
        UserLoginInfo: state.UserLoginInfo,
        MemberInfo: state.MemberInfo
    }
}, {receiveData, GetMerchantInfoAction, GetUserLoginInfoAction, GetMemberInfoAction})(App);
