import React, {Component} from 'react';
import {WhiteSpace, WingBlank, NoticeBar} from 'antd-mobile';
import {connect} from 'react-redux';

import MobileButton from '@/common/components/mobile_button/MobileButton';
import Card from '@/common/components/card/Card';
import DataItem from '@/home/components/data_item/DataItem';
import ModuleItem from '@/home/components/module_item/ModuleItem';

import card_detail from '@/home/assets/images/card_detail.png';
import notice_icon from '@/home/assets/images/notice_icon.png';
import pop_arrow from '@/home/assets/images/pop_arrow.png';
import gift from '@/base/assets/images/gift.png';

import homeService from '@/home/services/home.service';
import {GetMemberInfoAction} from '@/base/redux/actions';
import StoreService from '@/stored_value/services/recharge.service';

class Home extends Component {
    state = {
        cardObj: {},
        dataItems: new Map(),
        title: '',
        content: '',
        url: '',
        recommendRechargeRule: '', // 推荐充值
    };

    componentWillMount() {
        // 获取会员信息并放入Redux中
        const {GetMemberInfoAction} = this.props;
        GetMemberInfoAction();
        setTimeout(() => {
            const _this = this;
            const {MerchantInfo} = this.props;
            const params = {
                memberId: 1,
                merchantInfo: MerchantInfo,
                handleClick: {
                    goPetrolStoreValueList: this.goPetrolStoreValueList,
                    goGasStoreValueList: this.goGasStoreValueList,
                    goPointList: this.goPointList,
                    goCouponPackage: this.goCouponPackage
                }
            };
            
            homeService.getHomeData(params)
                .then((res) => {
                    _this.setState({
                        cardObj: res.cardObj,
                        dataItems: res.dataItems
                    })
                    this.bindRecommendRule(res.cards);
                })
                .catch((err) => {
                    console.log(err);
                });
            // 获取通知
            this.GetNotice();
        }, 200)
    }

    /**
     * 绑定推荐规则
     */
    bindRecommendRule = (cards) => {
        try {
            const {MerchantInfo} = this.props;
            StoreService.GetRechargeRuleData(cards[0].cardSpecId, MerchantInfo.id).then(res => {
                if (res != null && res.length > 0) {
                    let rerules = res.filter(r => r.topRecommended == 1);
                    if (rerules != null && rerules.length > 0) {
                        const temp = rerules[0];
                        let _info = `充值￥${temp.amount}送`;
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
                        this.setState({recommendRechargeRule: _info});
                    }
                }
            }).catch(err => {
                this.setState({recommendRechargeRule: ''});
            })
        } catch (error) {
        }
    }

    // 跳转汽油卡充值明细页面
    goPetrolStoreValueList = () => {
        this.props.history.push('/app/stored-value/list?cardSpecId=1');
    };

    // 跳转柴油卡充值明细页面
    goGasStoreValueList = () => {
        this.props.history.push('/app/stored-value/list?cardSpecId=2');
    };

    // 跳转我的油卡页面
    goOilCard = () => {
        this.props.history.push('/app/member/detail');
    };

    // 跳转积分列表页面
    goPointList = () => {
        this.props.history.push('/app/mall/point_detail');
    };

    // 跳转我的卡包页面
    goCouponPackage = () => {
        this.props.history.push('/app/coupon/coupon_package');
    };

    // 跳转会员卡详情页面
    clickEvent = () => {
        this.props.history.push('/app/member/card-detail');
    };

    // 跳转充值规则页面
    goRecharge = () => {
        this.props.history.push('/app/recharge');
    };

    // Card组件右侧的自定义区域：显示会员卡详情图片
    defineArea = () => {
        return (
            <img src={card_detail} onClick={this.clickEvent} alt="" />
        )
    };

    // 顶部通知栏左边的icon
    icon = () => {
        return (
            <img className="notice-icon" src={notice_icon} alt="" />
        )
    };

    /**
     * 获取轮播通知
     */
    GetNotice = () => {
        homeService.GetNotice().then(res => {
            if (res != null) {
                this.setState({
                    title: res.title,
                    content: res.content,
                    url: res.url
                })
            }
        })
    }

    /**
     * 获取卡片信息
     */
    getCardInfo = (MerchantInfo, card) => {
        // 商户卡片信息
        let cardObj = {}
        try {
            cardObj = {
                logo: MerchantInfo.logoUrl,
                title: MerchantInfo.name
            }
            // cardCoverType 0默认会员卡背景图片 1自定义图片，cardCoverChoice在cardCoverType为1时生效
            if (MerchantInfo.cardCoverType == 1) { // 自定义封面
                cardObj.bgImg = MerchantInfo.cardCoverChoice;
            }
            // 获取用户手机号作为会员ID
            cardObj = {...cardObj, phone: card.phone};
        } catch (error) {
        }
        return cardObj;
    }

    goToUrl = (url) => {
        if (url) {
            window.location.href = url;
        }
    }

    binNotice = () => {
        const {title, content, url} = this.state;
        if (title) {
            return (
                <NoticeBar
                    mode="closable"
                    icon={this.icon()}
                    marqueeProps={{ loop: true, style: { padding: '0 0' } }}
                >
                    <span onClick={() => this.goToUrl(url)}>【{title}】{content}</span>
                </NoticeBar>
            );
        } else {
            return null
        }
    }

    bindRecommend = (info) => {
        if (info == '') {
            return null;
        } else {
            return (
                <div>
                    <div className="pop-arrow"><img src={pop_arrow} alt="" /></div>
                    <div className="pop">
                        <img src={gift} alt="" />
                        <div className="pop-text">{info.length>15?(info.substr(0, 15).concat('...')):info}</div>
                    </div>
                </div>
            )
        }
    }

    render() {
        const {
            history,
            MerchantInfo
        } = this.props;

        const {
            cardObj,
            dataItems,
            recommendRechargeRule
        } = this.state;

        const cardinfo = this.getCardInfo(MerchantInfo, cardObj);

        return (
            <div className="animated fadeIn home-container">
                {this.binNotice()}
                <WhiteSpace size="sm" />
                <WingBlank size="md">
                    <Card
                        cardObj={cardinfo}
                        defineArea={this.defineArea()}
                    />
                    <WhiteSpace size="md" />
                    <DataItem dataItems={dataItems} />
                    <WhiteSpace size="lg" />
                    <div className="button-box">
                        <MobileButton
                            text="快速充值"
                            buttonClass="emptyButton"
                            isRound={false}
                            handleClick={this.goRecharge}
                        />
                        {this.bindRecommend(recommendRechargeRule)}
                    </div>
                    <WhiteSpace size="sm" />
                    <ModuleItem history={history} />
                </WingBlank>
            </div>
        )
    }
}

export default connect(state => ({
    MerchantInfo: state.MerchantInfo,
    MemberInfo: state.MemberInfo
}), {GetMemberInfoAction})(Home);