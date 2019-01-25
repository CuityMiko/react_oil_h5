import React, { Component } from 'react';
import { WingBlank, WhiteSpace, List, InputItem, Flex, Radio, Modal, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import {connect} from 'react-redux';
import moment from 'moment';

import MobileButton from '@/common/components/mobile_button/MobileButton';
import Field from '@/common/components/field/Field';
import SelectCouponPopup from '@/payment/containers/c_to_b/components/select_coupon_popup/SelectCouponPopup';
import AccountModal from '@/payment/containers/c_to_b/components/account_modal/AccountModal';

import select_oil from '@/payment/assets/images/select_oil.png';
import slide_icon from '@/payment/assets/images/slide_icon.png';
import discount_price_icon from '@/payment/assets/images/discount_price_icon.png';
import pay_gift from '@/payment/assets/images/pay_gift.png';
import coupon_icon from '@/payment/assets/images/coupon_icon.png';
import wechat from '@/base/assets/images/wechat.png';
import petrol_trade from '@/base/assets/images/petrol_trade.png';
import gasoline_trade from '@/base/assets/images/gasoline_trade.png';
import { receiveData, GetMerchantInfoAction, GetMemberInfoAction } from '@/base/redux/actions';
import PaymentService from '@/payment/services/payment.services';
import StoreService from '@/stored_value/services/recharge.service';
import {getWXCode} from '@/base/utils/index';
import BusinessService from '@/common/services/business/business.service';

const Item = List.Item;
const RadioItem = Radio.RadioItem;

class CToB extends Component {
    constructor() {
        super();
        this.mbrCoupons = [];
        this.cards = [];
        this.mcskus = [];
    }

    state = {
        moneyKeyboardWrapProps: '',
        // 油品
        oilPros: [],
        // 是否是会员
        isMember: false,
        memberId: 0, // 会员ID
        // 判断选中哪种支付方式
        value: 0,
        // 优惠券选择弹出默认关闭
        selectCouponModal: false,
        // 账户余额不足弹窗默认关闭
        accountModal: false,
        // 选中的油品的index
        oilProCheckedIndex: -1,
        merchantid: 0, // 商户ID
        merchantName: 0, // 商户名称
        mbrPrice: null, // 会员优惠价
        nonMbrPrice: null, // 非会员优惠价
        recommendruleinfo: '', // 推荐充值规则信息
        amount: '', // 输入金额
        actAmount: 0, // 每升立减优惠总额
        payType: 0, // 支付类型 0：微信 1：汽油卡 2：柴油卡
        payAmount: 0, // 支付金额
        coupons: [], // 用户可使用的优惠券
        cards: [], // 用户可用卡种
        couponcode: '', // 优惠券核销码
        currentCouponAmount: 0, // 当前优惠券金额
        couponReset: false, // 重置卡券列表
        cardAvailableAmount: 0, // 当前余额
        selSkuId: 0, // 选中的skuID
        selSkucardSpecId: 0, // 选中SKU对应的卡种ID
        mbrCardId: 0, // 会员卡ID
        payAuthCode: '', // 支付授权code
        qrcodeId: 0, // 二维码ID
        staffId: 0, // 员工ID,表示该笔订单的操作人
        userId: 0, // 员工对应的用户ID
        joinMemberUrl: '' // 加入会员跳转的URL
    };

    componentWillMount() {
        this.bindmoneyKeyboardWrap();
        // 绑定商户信息
        this.bindMerchantInfo((merchantid) => this.bindSkus(merchantid));
    }

    componentWillUnmount() {
        this.mbrCoupons = [];
        this.cards = [];
        this.mcskus = [];
    }

    bindmoneyKeyboardWrap = () => {
        // 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
        // https://github.com/ant-design/ant-design-mobile/issues/307
        // https://github.com/ant-design/ant-design-mobile/issues/163
        const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
        if (isIPhone) {
            this.setState({
                moneyKeyboardWrapProps: {
                    onTouchStart: e => e.preventDefault(),
                }
            });
        }
    }

    /**
     * 绑定商户信息
     */
    bindMerchantInfo = (callback) => {
        let merchantid = this.props.query.merchantId;
        let merchantName = this.props.query.merchantName;
        if (merchantid && merchantName) {
            document.title = merchantName;
            const {GetMerchantInfoAction} = this.props;
            GetMerchantInfoAction(merchantid);
            this.setState({merchantid}, () => {
                if (callback)
                    callback(merchantid)
            })
        } else {
            const {MerchantInfo} = this.props;
            if (MerchantInfo) {
                document.title = MerchantInfo.name;
                this.setState({merchantid: MerchantInfo.id}, () => {
                    if (callback)
                        callback(MerchantInfo.id)
                })
            } else {
                if (sessionStorage.getItem('merchantinfo')) {
                    let _MerchantInfo = JSON.parse(sessionStorage.getItem('merchantinfo'));
                    this.setState({merchantid: _MerchantInfo.id}, () => {
                        if (callback)
                            callback(_MerchantInfo.id)
                    })
                } else {
                    this.props.history.push('/app/home');
                }
            }
        }
    }

    /**
     * 判断是否是会员
     */
    judgeIsMember = (merchantid) => {
        const {MemberInfo} = this.props;
        let code = '';
        let merchantId = merchantid;
        if (MemberInfo) { // 登录
            code = '';
        } else { // 未登录
            let result_code = getWXCode('paywxcode');
            if (result_code != 1 && result_code != 0) {
                sessionStorage.removeItem('paywxcode');
                code = result_code;
                merchantId = this.props.query.merchantId;
            } else {
                if (this.props.query.code) {
                    code = this.props.query.code;
                    merchantId = this.props.query.merchantId;
                }
            }
        }
        BusinessService.JudgeIsMember({
            code,
            merchantId
        }).then(res => {
            if (res != null) {
                if (res.isMember) { // 会员
                    this.cards = res.cards;
                    this.setState({isMember: res.isMember, cards: res.cards, coupons: this.bindCouponData(res.coupons), 
                        payAuthCode: res.payAuthCode,
                        qrcodeId: this.props.query.qrcodeId,
                        staffId: this.props.query.staffId,
                        userId: this.props.query.userId,
                        memberId: res.cards[0].memberId
                    }, () => {
                        // 绑定充值推荐规则
                        this.bindRechargeRecommendRule(merchantid);
                        this.mbrCoupons = this.bindCouponData(res.coupons);
                    })
                } else { // 非会员
                    this.setState({isMember: res.isMember, cards: [], coupons: [], 
                        payAuthCode: res.payAuthCode,
                        qrcodeId: this.props.query.qrcodeId,
                        staffId: this.props.query.staffId,
                        userId: this.props.query.userId,
                        memberId: undefined,
                        joinMemberUrl: res.joinMemberUrl
                    }, () => {
                        // 绑定充值推荐规则
                        this.bindRechargeRecommendRule(merchantid);
                    })
                }
            }
        }).catch(err => {
            if (err.indexOf('used') > -1) {
                Toast.fail('请重新扫码支付！', 2);
            }
        }) 
    }

    /**
     * 绑定优惠券
     */
    bindCouponData = (coupons) => {
        let result = [];
        coupons.map(item => {
            let applyGoods = '-';
            let skuids = [];
            if (item.gasMbrProSkuDTOS && item.gasMbrProSkuDTOS.length > 0) {
                applyGoods = item.gasMbrProSkuDTOS.filter(s=>s.skuName!=null).map(s=>s.skuName).join('/');
                skuids = item.gasMbrProSkuDTOS.filter(s=>s.skuName!=null).map(s=>s.id);
            }
            let _ritem = {
                id: item.id,
                status: item.status,
                amount: item.couponAmount,
                leastCost: item.leastCost,
                name: item.couponName,
                code: item.code,
                date: '',
                applyGoods,
                skuids,
                actTimeStart: item.useTimeBegin,
                actTimeEnd: item.useTimeEnd,
                couponNumber: item.couponNumber,
                skus: item.gasMbrProSkuDTOS.map(s=>s.id)
            }
            // dateType 卡券使用有效期类型 0-固定时间 1-立即生效
            if(item.dateType == 0) {
                _ritem.date = `${moment(item.useTimeBegin).format('MM.DD')} - ${moment(item.useTimeEnd).format('MM.DD')}`;
            } else if(item.dateType == 1) {
                _ritem.date = `${moment().format('MM.DD')} - ${moment().add(item.fixedTerm - 1, 'days').format('MM.DD')}`;
            }
            result.push(_ritem)
        })
        // 绑定使用的优惠券
        this.bindUseCoupon(coupons);
        return result;
    }

    /**
     * 绑定使用的优惠券
     */
    bindUseCoupon = (coupons) => {
        const {couponnum} = this.props.query;
        const {couponcode} = this.state;
        if (couponcode == '' && couponnum) {
            let currc = coupons.find(c=>c.couponNumber == couponnum);
            if (currc) {
                this.setState({
                    couponcode: currc.code,
                    currentCouponAmount: parseFloat(currc.couponAmount).toFixed(2)
                }, () => {
                    this.rebindSkus(currc.gasMbrProSkuDTOS.filter(s=>s.skuName!=null).map(s=>s.id));
                })
            } else {
                this.setState({
                    couponcode: '',
                    currentCouponAmount: 0
                })
            }
        }
    }

    /**
     * 获取优惠券Code
     */
    getCouponClick = (val, amount) => {
        const _self = this;
        if (val && amount) {
            _self.setState({couponcode: val, currentCouponAmount: parseFloat(amount).toFixed(2)}, () => {
                _self.onClose('selectCouponModal');
                // 重新计算金额
                _self.computeAmount();
            });
        } else {
            _self.setState({couponcode: '', currentCouponAmount: 0}, () => {
                _self.onClose('selectCouponModal');
                // 重新计算金额
                _self.computeAmount();
            });
        }
    }

    /**
     * 选择优惠券
     */
    selectCoupon = () => {
        this.showModal('selectCouponModal')
    }

    /**
     * 重新绑定卡券
     */
    reBindCoupon = () => {
        let _coupons = this.mbrCoupons;
        const {payAmount, actAmount, amount, selSkuId} = this.state;
        if (_coupons && _coupons.length > 0) {
            if (amount == '') { // 没有输入金额
                // 根据SKU筛选
                if (selSkuId) {
                    // 筛选SKU
                    let _temp = _coupons.filter(c => c.skus.indexOf(selSkuId) > -1);
                    this.setState({coupons: _temp}, () => {
                        // 绑定使用的优惠券
                        this.bindUseCoupon(_temp);
                    });
                }
            } else {
                let nowamount = payAmount + Number(actAmount);
                nowamount = nowamount > 0 ? nowamount : 0;
                // 筛选金额
                let newcoupons = _coupons.filter(c => c.leastCost <= parseFloat(nowamount).toFixed());
                // 筛选SKU
                let _temp = newcoupons.filter(c => c.skus.indexOf(selSkuId) > -1);
                this.setState({coupons: _temp}, () => {
                    // 绑定使用的优惠券
                    this.bindUseCoupon(_temp);
                });
            }
        } else {
            this.setState({coupons: []}, () => {
                // 绑定使用的优惠券
                this.bindUseCoupon([]);
            })
        }
    }

    // 弹出选择优惠券
    showModal = key => {
        this.setState({
            [key]: true
        })
    };

    // 关闭弹窗
    onClose = key => {
        this.setState({
            [key]: false,
        });
    };

    /**
     * 绑定SKU
     */
    bindSkus = (merchantid) => {
        PaymentService.GetSkuData(merchantid).then(res => {
            if (res != null && res.length > 0) {
                let oildata = res.map(c => ({id: c.id, name: c.name, 
                    price: c.price || 0, // 原价
                    mbrPrice: c.mbrPrice, // 会员优惠价
                    nonMbrPrice: c.nonMbrPrice, // 非会员优惠价
                    cardSpecId: (c.matchCardSpecIds[0] || 0)}))
                this.mcskus = oildata;
                this.setState({oilPros: oildata}, () => {
                    // 判断是否是会员
                    this.judgeIsMember(merchantid);
                });
            }
        })
    }

    /**
     * 重新绑定SKU
     */
    rebindSkus = (skuids) => {
        if (skuids && skuids.length > 0 && this.mcskus && this.mcskus.length > 0) {
            let _tempskus = [];
            skuids.map(c => {
                let _tempsku = this.mcskus.find(s => s.id == c);
                if (_tempsku) {
                    _tempskus.push(_tempsku);
                }
            })
            this.setState({oilPros: _tempskus})
        }
    }

    // 点击油品进行的回调函数
    oilProClick = (index, item) => {
        let cards = this.cards.filter(c => c.specId == item.cardSpecId);
        let {couponcode, currentCouponAmount} = this.state;
        if (this.props.query.couponnum == undefined) {
            couponcode = '';
            currentCouponAmount = 0;
        }
        this.setState({
            oilProCheckedIndex: index,
            price: item.price,
            mbrPrice: item.mbrPrice,
            nonMbrPrice: item.nonMbrPrice,
            selSkuId: item.id,
            selSkucardSpecId: item.cardSpecId,
            cards,
            couponcode,
            currentCouponAmount
        }, () => {
            // 计算优惠价格
            this.computeAmount();
        })
    };

    /**
     * 绑定充值推荐规则
     */
    bindRechargeRecommendRule = (merchantid) => {
        const {isMember, cards} = this.state;
        // 获取商户ID
        let merchantId = merchantid;
        // 获取卡种ID 默认汽油
        let _cardSpecId = 1;
        if (isMember) { // 会员
            if (cards && cards.length > 0) {
                if (cards.length == 1) {
                    _cardSpecId = cards[0].specId;
                }
            }
        } else { // 非会员，显示汽油充值规则
            _cardSpecId = 1;
        }
        try {
            StoreService.GetRechargeRuleData(_cardSpecId, merchantId).then(res => {
                if (res != null && res.length > 0) {
                    let rerules = res.filter(r => r.topRecommended == 1);
                    if (rerules != null && rerules.length > 0) {
                        const temp = rerules[0];
                        let _info = `充值¥${temp.amount}送`;
                        switch (temp.giftType) {
                            case 0: // 送金额
                                _info = _info + `￥${temp.giftContent}`;
                                break;
                            case 1: // 送积分
                                _info = _info + `${temp.giftContent}积分`;
                                break;
                            case 2: // 送优惠券
                                _info = _info + `${(temp.giftContentName || '')}优惠券`;
                                break;
                            default:
                                break;
                        }
                        if (_info.length > 10) {
                            _info = _info.substring(0, 10) + '...';
                        }
                        _info = _cardSpecId == 1 ? `【汽油卡】 ${_info}` : `【柴油卡】 ${_info}`;
                        this.setState({recommendruleinfo: _info});
                    }
                }
            }).catch(err => {
                this.setState({recommendruleinfo: ''});
            })
        } catch (error) {
            this.setState({recommendruleinfo: ''});
        }
    }

    // 选择支付方式
    onPayTypeChange = (key) => {
        this.setState({
            payType: key
        }, () => {
            if (key != 0) { // 非微信支付
                const {cards} = this.state;
                const card = cards.find(c=>c.specId == key);
                if (card) {
                    this.setState({
                        cardAvailableAmount: card.availableAmount,
                        mbrCardId: card.cardId
                    })
                }
            }
        })
    };

    /**
     * 去充值
     */
    goRecharge = () => {
        this.props.history.push('/app/recharge');
    }

    /**
     * 输入金额改变
     */
    amountChange = (val) => {
        this.setState({amount: val}, () => {
            // 计算优惠价格
            this.computeAmount();
        });
    }

    /**
     * 计算优惠价格
     */
    computeAmount = () => {
        const {amount, price, isMember, mbrPrice, nonMbrPrice, currentCouponAmount} = this.state;
        let shengCount = parseFloat(amount) / price;
        let youhuiAmount = 0;
        let payAmount = amount;
        let actAmount = 0;
        if (isMember) {
            if (mbrPrice != null) {
                youhuiAmount = shengCount * (price - mbrPrice);
            }
        } else {
            if (nonMbrPrice != null) {
                youhuiAmount = shengCount * (price - nonMbrPrice);
            }
        }
        actAmount = parseFloat(youhuiAmount).toFixed(2)
        payAmount = parseFloat(amount - actAmount - currentCouponAmount).toFixed(2);
        payAmount = payAmount > 0 ? payAmount : 0;
        this.setState({actAmount, payAmount}, () => {
            if (this.props.query.couponnum == undefined) {
                // 重新绑定卡券
                this.reBindCoupon();
            }
        });
    }

    /**
     * 加入会员
     */
    toMember = () => {
        const {joinMemberUrl} = this.state;
        // sessionStorage.setItem('JumpRoute', window.location.hash.substring(1, window.location.hash.length));
        window.location.href = joinMemberUrl;
    }

    /**
     * 去付款
     */
    toPay = () => {
        const {selSkuId, payAmount, cardAvailableAmount, payType, amount, memberId,
            couponcode, mbrCardId, merchantid, payAuthCode, qrcodeId, staffId, userId, isMember} = this.state;
        if (selSkuId == 0) {
            Toast.fail('请选择油品!', 1);
            return;
        }
        if (payType != 0) { // 非微信支付，需判断卡片余额
            if (payAmount > cardAvailableAmount) {
                this.showModal('accountModal');
                return;
            }
        }
        // 判断起用金额
        let currentCoupon = this.mbrCoupons.find(c=>c.code == couponcode);
        if (currentCoupon) {
            if (amount < currentCoupon.leastCost) {
                Toast.fail(`优惠券满${currentCoupon.leastCost}使用！`, 1);
                return;
            }
        }
        if (amount !=  '' && payAmount <= 0 && payType == 0) { // 不使用微信支付
            Toast.fail('请选择支付方式!', 1);
            return;
        }
        // 获取会员ID
        let mbrId = 0;
        const {MemberInfo} = this.props;
        if (MemberInfo) {
            mbrId = MemberInfo.id;
        } else {
            mbrId = memberId;
        }
        let condition = {
            amount, // 用户输入金额
            couponCode: couponcode, // 优惠券核销码
            mbrCardId: payType == 0 ? null : mbrCardId, // 会员卡ID
            mbrId, // 会员ID
            merchantId: merchantid, // 商户ID
            payAuthCode, // 支付授权code
            payEntry: payType == 0 ? 0 : 6, // 支付入口,0-微信 1-支付宝 6-会员卡
            skuId: selSkuId, // 选择油品ID
            qrcodeId, // 二维码ID
            staffId, // 员工ID,表示该笔订单的操作人
            userId // 员工对应的用户ID
        }
        PaymentService.ToPay(condition).then(res => {
            if (res != null) {
                if (res.needRedirect && res.needRedirect == true) {
                    window.location.href = res.redirectUrl;
                } else {
                    this.props.history.push('/app/payment/pay_success?result=' + encodeURIComponent(JSON.stringify(res)) + '&isMember=' + isMember);
                }
            } else {
                Toast.fail('支付失败，请重试！', 2)
            }
        })
    }

    render() {
        const {
            getFieldProps,
        } = this.props.form;

        const {
            moneyKeyboardWrapProps,
            oilPros,
            isMember,
            payType,
            selectCouponModal,
            accountModal,
            oilProCheckedIndex,
            price, // 原价
            mbrPrice, // 会员优惠价
            nonMbrPrice, // 非会员优惠价
            recommendruleinfo,
            amount,
            actAmount,
            payAmount, // 支付金额
            cards,
            currentCouponAmount,
            coupons, // 优惠券
            couponReset, // 重置卡券
            cardAvailableAmount, // 当前卡片支付余额
            couponcode,
            selSkucardSpecId // 选中SKU对应的卡种ID
        } = this.state;
        return (
            <div className="grey-back c-to-b-container">
                <WhiteSpace size="xs" />
                <WingBlank size="sm">
                    <div className="header">
                        <WingBlank size="sm">
                            <WhiteSpace size="xs" />
                            {/*数字键盘*/}
                            <List>
                                <InputItem
                                    {...getFieldProps('money3')}
                                    type="money"
                                    placeholder="请输入金额"
                                    clear
                                    value={amount}
                                    moneyKeyboardAlign="left"
                                    onChange={this.amountChange}
                                    moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                                >¥</InputItem>
                            </List>
                            <Field text="油品选择" imgSrc={select_oil} customClass="select-oil-field">
                                <div className="right">
                                    <div>滑动可选择不同油品</div>
                                    <img src={slide_icon} alt="" />
                                </div>
                            </Field>
                        </WingBlank>
                        {/*油品选择动画*/}
                        <div className="oil-pro-box">
                            <Flex>
                                {
                                    oilPros.map((item, index) => {
                                        return (
                                            <div className={index === oilProCheckedIndex?'oil-pro oil-pro-checked':'oil-pro'}
                                                 key={index}
                                                 onClick={() => this.oilProClick(index, item)}
                                            >{item.name.length>3?(item.name.substr(0,3).concat('...')):item.name}</div>
                                        )
                                    })
                                }
                            </Flex>
                        </div>
                        <WingBlank size="sm">
                            {/*油品单价*/}
                            <div className="oil-price-box">
                                <Flex>
                                    {
                                        price > 0 ? (
                                            <Flex.Item>
                                                <Field text="油品单价" customClass="oil-price-field">
                                                    <div>¥{price}/L</div>
                                                </Field>
                                            </Flex.Item>
                                        ) : null
                                    }
                                    {
                                        isMember && mbrPrice != null ? (
                                            <Flex.Item>
                                                <Field text="优惠后" customClass="oil-price-field discount-price-field">
                                                    <div className="oil-price-field-right">
                                                        <img src={discount_price_icon} alt="" />
                                                        <div>¥{mbrPrice}/L</div>
                                                    </div>
                                                </Field>
                                            </Flex.Item>
                                        ) : null
                                    }
                                    {
                                        !isMember && nonMbrPrice != null ? (
                                            <Flex.Item>
                                                <Field text="优惠后" customClass="oil-price-field discount-price-field">
                                                    <div className="oil-price-field-right">
                                                        <img src={discount_price_icon} alt="" />
                                                        <div>¥{nonMbrPrice}/L</div>
                                                    </div>
                                                </Field>
                                            </Flex.Item>
                                        ) : null
                                    }
                                </Flex>
                            </div>
                            <List>
                                {
                                    this.props.query.couponnum == undefined ? (
                                        coupons.length > 0 ? (
                                            <Item
                                                arrow="horizontal"
                                                thumb={coupon_icon}
                                                extra={currentCouponAmount > 0 ? `-¥${currentCouponAmount}` : '选择优惠券'}
                                                onClick={this.selectCoupon}
                                            >&nbsp;</Item>
                                        ) : (
                                            <Item
                                                thumb={coupon_icon}
                                                extra='暂无可用卡券'
                                            >&nbsp;</Item>
                                        )
                                    ) : (
                                        <Item
                                            thumb={coupon_icon}
                                            extra={`-¥${currentCouponAmount}`}
                                        >&nbsp;</Item>
                                    )
                                }
                                {
                                    actAmount > 0 ? (<Item style={{marginRight: 25}} extra={`-¥${actAmount}`}>活动优惠总额</Item>) : null
                                }
                            </List>
                            <Modal
                                popup
                                visible={selectCouponModal}
                                onClose={() => this.onClose('selectCouponModal')}
                                animationType="slide-up"
                            >
                                <SelectCouponPopup payAmount={Number(payAmount)} code={couponcode} isReset={couponReset} couponData={coupons} getCouponClick={this.getCouponClick} />
                            </Modal>
                        </WingBlank>
                    </div>
                </WingBlank>
                <WhiteSpace size="xs" />
                {/*选择付款方式*/}
                <WingBlank size="sm">
                    <div className="middle">
                        <WingBlank size="sm">
                            <Field text="选择付款方式" customClass="select-pay-field">
                                {
                                    recommendruleinfo == '' ? null : (
                                        <div className="select-pay-right">
                                            <img src={pay_gift} alt="" />
                                            <div onClick={this.goRecharge}>{recommendruleinfo.length>15?(recommendruleinfo.substr(0, 15).concat('...')):recommendruleinfo}</div>
                                        </div>
                                    )
                                }
                            </Field>
                            {
                                amount !=  '' && payAmount <= 0 ? null : (
                                    <Field text="微信支付" imgSrc={wechat} customClass="pay-field">
                                        <RadioItem key={0} checked={payType === 0} onChange={() => this.onPayTypeChange(0)} />
                                    </Field>
                                )
                            }
                            {
                                isMember ? (
                                    cards.length > 0 ? (
                                        cards.map((card, index) => {
                                            return (
                                                <Field key={index} text={card.specId == 1 ? '汽油卡' : '柴油卡'} imgSrc={card.specId == 1 ? petrol_trade : gasoline_trade} subtext={`（剩余：¥${card.availableAmount}）`} customClass="pay-field">
                                                    <RadioItem key={card.specId} checked={payType === card.specId} disabled={card.availableAmount <= 0} onChange={() => this.onPayTypeChange(card.specId)}/>
                                                </Field>
                                            )
                                        })
                                    ) : null
                                ) : (
                                    <div>
                                        <Field text="汽油卡" imgSrc={petrol_trade} subtext="（非会员不可使用）" customClass="pay-field">
                                            <RadioItem disabled/>
                                        </Field>
                                        <Field text="柴油卡" imgSrc={gasoline_trade} subtext="（非会员不可使用）" customClass="pay-field">
                                            <RadioItem disabled/>
                                        </Field>
                                    </div>
                                )
                            }
                        </WingBlank>
                    </div>
                </WingBlank>
                <WhiteSpace size="lg" />
                <WingBlank size="sm">
                    <MobileButton text={`付款（¥${payAmount}）`} customClass="c-to-b-button" buttonClass="longButton" handleClick={this.toPay} />
                    <Modal
                        transparent
                        visible={accountModal}
                        onClose={() => this.onClose('accountModal')}
                        animationType="slide-up"
                    >
                        <AccountModal
                            payAmount={parseFloat(payAmount).toFixed(2)}
                            availableAmount={parseFloat(cardAvailableAmount).toFixed(2)}
                            handleClick={() => {this.props.history.push('/app/recharge')}}
                            onClose={() => this.onClose('accountModal')} />
                    </Modal>
                </WingBlank>
                {
                    isMember ? null : (
                        <div>
                            <WhiteSpace size="xs" />
                            <WingBlank size="sm">
                                <MobileButton text="加入会员" customClass="c-to-b-button" buttonClass="emptyButton" handleClick={this.toMember} />
                            </WingBlank>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default connect(state => ({
    MerchantInfo: state.MerchantInfo,
    MemberInfo: state.MemberInfo
}), {
    receiveData,
    GetMerchantInfoAction,
    GetMemberInfoAction
})(createForm()(CToB));