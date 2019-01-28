import React, {Component} from 'react';
import { WingBlank, WhiteSpace, ActivityIndicator } from 'antd-mobile';
import moment from 'moment';
import {connect} from 'react-redux';

import Field from "@/common/components/field/Field";
import MobileButton from "@/common/components/mobile_button/MobileButton";
import PopupComponent from '@/common/components/popup_component/PopupComponent';
import CouponComponent from '@/common/components/coupon_component/CouponComponent';
import {GetMemberInfoAction} from '@/base/redux/actions';
import order_icon from '@/stored_value/assets/images/order_icon.png';
import gasoline_trade from '@/base/assets/images/gasoline_trade.png';
import petrol_trade from '@/base/assets/images/petrol_trade.png';
import gift_coupon_popup from '@/stored_value/assets/images/gift_coupon_popup.png';
import alipay from '@/common/components/store_point_detail/assets/alipay.png';
import wechat from '@/base/assets/images/wechat.png';
import RechargeService from '@/stored_value/services/recharge.service';
import CouponService from '@/coupon/services/coupon.service';

class RechargeSuccess extends Component {
    constructor() {
        super();
        this.rsTimer = 0;
    }
    state = {
        listItems: {},
        // 包装过的数据源
        itemsMap: new Map(),
        modal: false, // 默认进入该页面显示弹窗
        couponItem: {},
        hasResult: false
    };

    componentWillMount() {
        this.GetRechargeResult();
        /**
         * 轮询支付后结果
         */
        this.rsTimer = setInterval(() => {
            // 查询充值结果
            this.GetRechargeResult();
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.rsTimer);
    }

    /**
     * 获取充值结果
     */
    GetRechargeResult = () => {
        const orderid = this.props.query.orderId;
        RechargeService.GetRechargeResult(orderid).then(res => {
            if (res != null && res.createTime != null) {
                clearInterval(this.rsTimer);
                let result = {
                    rechargeAmount: res.amount,
                    afterRechargeAccount: res.postTradeBalance,
                    tradeCard: res.cardSpecName,
                    method: res.payEntryText,
                    tradeNumber: res.orderNumber,
                    time: moment(res.createTime).format('YYYY.MM.DD hh:ss'),
                    giftContent: res.giftContent, // 赠送
                    giftType: res.giftType // 赠送类型 0：金额 1：积分 2：卡券
                }
                if (res.giftType == 2) { // 卡券
                    this.bindCouponData(res.giftContent);
                }
                this.setState({
                    listItems: result
                }, () => {
                    this.bindDataMap();
                })
            }
        })
    }

    /**
     * 绑定优惠券数据
     */
    bindCouponData = (id) => {
        CouponService.GetCouponDetail({couponId: id, couponNumber: null}).then(res => {
            if (res != null) {
                let applyGoods = '-';
                let date = '';
                if (res.skus && res.skus.length > 0) {
                    applyGoods = res.skus.filter(s=>s.skuName!=null).map(s=>s.skuName).join('/');
                }
                // dateType 卡券使用有效期类型 0-固定时间 1-立即生效
                if(res.dateType == 0) {
                    date = `${moment(res.useTimeBegin).format('MM.DD')} - ${moment(res.useTimeEnd).format('MM.DD')}`
                } else if(res.dateType == 1) {
                    date = `领取后${res.fixedTerm}天有效`
                }
                let couponItem = {...res, date, applyGoods};
                this.setState({couponItem})
            }
        })
    }

    /**
     * 绑定Map
     */
    bindDataMap = () => {
        const { listItems } = this.state;
        // 对数据源进行key的转换，英文转文字
        let _itemsMap = new Map();
        Object.keys(listItems).map(key => {
            switch (key) {
                case 'rechargeAmount':
                    _itemsMap.set(1, ['充值金额', listItems[key]]);
                    break;
                case 'afterRechargeAccount':
                    _itemsMap.set(2, ['充值后余额', listItems[key]]);
                    break;
                case 'tradeCard':
                    _itemsMap.set(3, ['加油卡', listItems[key]]);
                    break;
                case 'method':
                    _itemsMap.set(4, ['支付方式', listItems[key]]);
                    break;
                case 'tradeNumber':
                    _itemsMap.set(5, ['交易单号', listItems[key]]);
                    break;
                case 'time':
                    _itemsMap.set(8, ['充值时间', listItems[key]]);
                    break;
                default:
                    break;
            }
            return _itemsMap;
        });
        // 对转换过的数据源进行排序
        const _keys = _itemsMap.keys();
        let sortKeys = [..._keys].sort((x, y) => x - y);
        let itemsMap = new Map();
        sortKeys.map((_item) => {
            return itemsMap.set(_item, _itemsMap.get(_item))
        });
        this.setState({
            itemsMap: itemsMap,
            hasResult: true,
            modal: listItems.giftType == 2 // 赠送优惠券
        });
    }

    // 判断field右侧的显示
    judgeDisplay = (key, value) => {
        if(key === '支付方式') {
            return (
                <div className="field-right-content">
                    <img className="field-icon" src={value.indexOf('支付宝') > -1 ? alipay : wechat} alt="" />
                    <div>{value}</div>
                </div>
            )
        } else if(key === '加油卡') {
            return (
                <div className="field-right-content">
                    <img className="field-icon" src={value === '汽油卡'?petrol_trade:gasoline_trade} alt="" />
                    <div>{value}</div>
                </div>
            )
        } else if(key === '充值金额' || key === '充值后余额' ) {
            if(key === '充值金额') {
                return (<div className="high-light">¥{value}</div>)
            } else {
                return `¥${value}`;
            }
        }
        else {
            return value;
        }
    };

    // 关闭弹窗
    onClose = key => () => {
      this.setState({
          [key]: false
      })
    };

    /**
     * 返回首页
     */
    goToHome = () => {
        const {GetMemberInfoAction} = this.props;
        // 更新用户信息
        GetMemberInfoAction();
        this.props.history.push('/app/home');
    }

    /**
     * 优惠券去使用
     */
    goToPay = (couponNumber) => {
        this.props.history.push('/app/payment?couponnum=' + couponNumber)
    }

    /**
     * 获取内容
     */
    GetContent = () => {
        const {hasResult, itemsMap, modal, couponItem, listItems} = this.state;
        if (hasResult) {
            return (
                <div className="animated fadeIn grey-back recharge-success-container">
                    <PopupComponent visible={modal} onClose={this.onClose('modal')} direction="flex-start">
                        <div className="recharge-gift-coupon-popup">
                            <img src={gift_coupon_popup} alt="" />
                            <div className="text">送您一张优惠券</div>
                            <WingBlank size="sm">
                                <CouponComponent couponItem={couponItem}>
                                    <MobileButton text="去使用" handleClick={() => this.goToPay(couponItem.couponNumber)} customClass="shortButton" />
                                </CouponComponent>
                            </WingBlank>
                        </div>
                    </PopupComponent>
                    <div className="content">
                        <WhiteSpace size="xs" />
                        <WingBlank size="sm">
                            <div className="banner">
                                <div className="box">
                                    <div className="title">充值成功</div>
                                    <div className="gift-amount">{listItems.giftType == 0 ? `赠送金额：¥${listItems.giftContent}元` : listItems.giftType == 1 ? `赠送积分：${listItems.giftContent}积分` : null}</div>
                                </div>
                            </div>
                            <Field text="订单详情" imgSrc={order_icon} customClass="field-class" />
                            {
                                [...itemsMap].map((item, index) => {
                                    return (
                                        <Field text={item[1][0]} key={index}
                                            customClass={`store-point-detail-field ${(item[1][0] === '支付方式')?'field-border':''}`}
                                        >
                                            {this.judgeDisplay(item[1][0], item[1][1])}
                                        </Field>
                                    )
                                })
                            }
                        </WingBlank>
                    </div>
                    <WhiteSpace size="xl" />
                    <WingBlank size="md">
                        <MobileButton text="确 认" handleClick={this.goToHome} customClass="longButton" />
                    </WingBlank>
                </div>
            )
        } else {
            return <ActivityIndicator size="large" animating={!hasResult} toast text="等待充值结果中，请稍等..." />
        }
    }

    render() {
        return this.GetContent();
    }
}

export default connect(
    state => ({}),
    {GetMemberInfoAction}
)(RechargeSuccess);