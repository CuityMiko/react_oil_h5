import React, {Component} from 'react';
import { Tabs, Toast } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import {connect} from 'react-redux';
import QueueAnim from 'rc-queue-anim';

import RechargeComponent from "@/stored_value/containers/recharge/components/recharge_component/RechargeComponent";
import BottomContent from "@/common/components/bottom_content/BottomContent";
import MobileButton from "@/common/components/mobile_button/MobileButton";
import RechargeService from '@/stored_value/services/recharge.service';
import {GetMemberInfoAction} from '@/base/redux/actions';

class Recharge extends Component {
    state = {
        tabs: [],
        rechargeItems: [],
        // 可重新定义字段判断是否显示tab栏
        cardCount: 0,
        availableAmount: 0,
        cardSpecId: 1,
        storedDesc: '-', // 充值说明
        QdefineRecharge: false, // 汽油卡自定义金额
        CdefineRecharge: false, // 柴油卡自定义金额
        rechargeAccount: 0,
        rechargeRuleId: 0,
        cardId: 0,
    };

    componentWillMount() {
        // 获取用户最新信息
        const {GetMemberInfoAction} = this.props;
        GetMemberInfoAction();
        // 绑定Tabs
        setTimeout(() => {
            this.bindCurrentRechargeInfo(() => {
                this.bindTabs();
            })
        }, 300)
    }

    /**
     * 绑定当前充值项
     */
    bindCurrentRechargeInfo = (callback) => {
        const {specId} = this.props.query;
        if (specId) {
            this.setState({
                cardSpecId: specId
            }, () => {
                callback();
            })
        } else {
            this.setState({
                cardSpecId: 1
            }, () => {
                callback();
            })
        }
    }

    /**
     * 绑定充值规则列表
     */
    bindRechargeRuleData = () => {
        const {QdefineRecharge, CdefineRecharge, cardSpecId} = this.state;
        const {MerchantInfo} = this.props;
        RechargeService.GetRechargeRuleData(cardSpecId, MerchantInfo.id).then(res => {
            if (res != null && res.length > 0) {
                let _rechargeItems = [];
                res = res.sort((x, y) => y.topRecommended - x.topRecommended);
                res.map((r, index) => {
                    if (index == 0) {
                        this.setState({
                            rechargeRuleId: r.id,
                            rechargeAccount: r.amount
                        })
                    }
                    let ritem = {
                        id: r.id,
                        type: r.giftType == 0 ? 2 : r.giftType == 1 ? 1 : 3, // 1-送积分  2-送充值  3-送卡券
                        amount: r.amount,
                        value:  r.giftType < 2 ? r.giftContent : `${(r.giftContentName || '')}优惠券`,
                        flag: index == 0 && r.topRecommended == 1 ? 1 : 0 // 设为推荐
                    }
                    _rechargeItems.push(ritem);
                })
                if (cardSpecId == 1 && QdefineRecharge) {
                    _rechargeItems.push({id: -1, defineRecharge: QdefineRecharge})
                }
                if (cardSpecId == 2 && CdefineRecharge) {
                    _rechargeItems.push({id: -1, defineRecharge: CdefineRecharge})
                }
                this.setState({rechargeItems: _rechargeItems})
            }
        });
    }

    /**
     * 绑定Tabs
     */
    bindTabs = () => {
        const {MemberInfo} = this.props;
        const {cardSpecId} = this.state;
        if (MemberInfo != null && MemberInfo.cards.length > 0) {
            let tabs = [];
            MemberInfo.cards.map(card => {
                let tab = {
                    title: card.cardSpecId == 1 ? '汽油卡' : '柴油卡',
                    cardSpecId: card.cardSpecId,
                    availableAmount: card.availableAmount,
                    cardId: card.cardId
                }
                tabs.push(tab);
            })
            let currtab = tabs.find(t => t.cardSpecId == cardSpecId);
            this.setState({
                tabs, cardCount: MemberInfo.cards.length, 
                availableAmount: currtab ? currtab.availableAmount : tabs[0].availableAmount, 
                cardSpecId,
                cardId: currtab ? currtab.cardId : tabs[0].cardId
            }, () => {
                // 获取规则配置
                this.GetRechargeConfig();
            })
        }
    }

    // tab栏固定
     renderTabBar = (props) => {
        return (<Sticky>
            {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
        </Sticky>);
    };

    /**
     * 选择Tab
     */
    tabChange = (tab) => {
        this.setState({
            availableAmount: tab.availableAmount, 
            cardSpecId: tab.cardSpecId,
            rechargeItems: [],
            storedDesc: '-',
            cardId: tab.cardId
        }, () => {
            // 获取规则配置
            this.GetRechargeConfig();
        })
    }

    /**
     * 获取充值规则配置
     */
    GetRechargeConfig = () => {
        const {cardSpecId} = this.state;
        RechargeService.GetRechargeConfig(cardSpecId).then(res => {
            if (res != null) {
                this.setState({storedDesc: res.storedDesc || '', QdefineRecharge: res.storedCustomerSwitch > 0 && cardSpecId == 1, CdefineRecharge: res.storedCustomerSwitch > 0 && cardSpecId == 2});
            }
            this.bindRechargeRuleData();
        })
    }

    /**
     * 选择充值项
     */
    rechargeHandleClick = (id, amount) => {
        this.setState({
            rechargeRuleId: id,
            rechargeAccount: amount || 0
        })
    }

    /**
     * 自定义金额变化
     */
    customInputChange = (val) => {
        this.setState({
            rechargeRuleId: -1,
            rechargeAccount: val
        })
    }

    /**
     * 充值下单
     */
    ToRechargeAndOrder = () => {
        const {rechargeRuleId, rechargeAccount, cardId} = this.state;
        if (rechargeRuleId && rechargeAccount) {
            if (rechargeAccount <= 0) {
                Toast.info('充值金额有误');  
              } else {
                  RechargeService.ToRecharge({
                      rechargeRuleId,
                      amount: Number(rechargeAccount),
                      cardId
                  }).then(res => {
                      if (res != null) {
                          if (res.orderId) {
                            sessionStorage.setItem('recharge_orderid', res.orderId);
                          }
                          if (res.url) {
                            window.location.href = res.url;
                          }
                      }
                  })
              }
        } else {
            Toast.info('充值信息有误，请重试');
        }
    }

    render() {
        const {
            tabs,
            cardCount,
            rechargeItems,
            availableAmount,
            storedDesc,
            defineRecharge,
            cardSpecId
        } = this.state;
        return (
            <div className="animated fadeIn recharge-container" key="recharge">
                {
                    // 如果用户只有单张卡，则不显示tab栏
                    cardCount > 1 ? (
                        <StickyContainer>
                            <Tabs tabs={tabs} swipeable={false} initialPage={(cardSpecId - 1)} renderTabBar={this.renderTabBar} onChange={this.tabChange}>
                                <RechargeComponent customInputChange={this.customInputChange} handleClick={this.rechargeHandleClick} defineRecharge={defineRecharge} rechargeItems={rechargeItems} cardType= {cardSpecId == 1 ? 'petrol' : 'gas'} account={availableAmount} rechargeIntro={storedDesc} />
                            </Tabs>
                        </StickyContainer>
                    ) : (
                        <RechargeComponent customInputChange={this.customInputChange} handleClick={this.rechargeHandleClick} defineRecharge={defineRecharge} rechargeItems={rechargeItems} cardType="gas" account={availableAmount} rechargeIntro={storedDesc} />
                    )
                }
                {
                    rechargeItems.length > 0 ? <BottomContent customClass="bottom-content">
                        <div className="button-box">
                            <MobileButton text="确定充值" buttonClass="longButton" customClass="button-class" handleClick={this.ToRechargeAndOrder} />
                        </div>
                    </BottomContent> : null
                }
            </div>
        );
    }
}

export default connect(state => ({
    MemberInfo: state.MemberInfo,
    MerchantInfo: state.MerchantInfo
}), {GetMemberInfoAction})(Recharge);