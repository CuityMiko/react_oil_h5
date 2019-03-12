import React, {Component} from 'react';
import { WingBlank, WhiteSpace, Toast } from 'antd-mobile';
import {connect} from 'react-redux';
import QueueAnim from 'rc-queue-anim';

import MobileButton from '@/common/components/mobile_button/MobileButton';
import Field from '@/common/components/field/Field';
import OilCardActivation from '@/oil_card/containers/activation/components/oil_card_activation/OilCardActivation';

import select_oil_card from '@/oil_card/assets/images/select_oil_card.png';

import ActivationService from '@/oil_card/services/activation/activation.service';
import {GetMemberInfoAction} from '@/base/redux/actions';

class Activation extends Component {
    state = {
        // 存放卡片的checkbox是否被选中 1-汽油卡 2-柴油卡
        cardChecked: [],
        // redux中取到的数据源
        oldCardData: [],
        // 包装过的数据源，加上了icon和bgImg
        newCardData: []
    };

    componentDidMount() {
        // 请求会员卡列表
        ActivationService.getCardList().then(res => {
            if(this.props.query.flag == 'login') {
                // enable 商家是否开启了这张卡 0-未开启 1-已开启
                let _res = res.filter(card => card.enable > 0);
                this.setState({
                    oldCardData: _res
                });
                this.bindCardData(_res);
            } else {
                this.setState({
                    oldCardData: res
                });
                this.bindCardData(res);
            }
        })
    }

    /**
     * 包装卡片数据源
     */
    bindCardData = (oldcarddata) => {
        const {query} = this.props;
        let newCardData = [];
        let newcardChecked = []
        // 包装数据源
        oldcarddata.map((card) => {
            // 将适用油品拼接成一个字符串
            const _proSkuDTOS = card.proSkuDTOS;
            let pro = _proSkuDTOS.filter(s=>s.skuName!=null).map(item => item.skuName).join('/');
            // 适用油品长度超过20个字的处理
            if(pro.length >= 18) {
                pro = pro.substring(0, 18).concat('...');
            }
            // 加上icon,bgImg,pro等属性
            newCardData.push(Object.assign({}, {...card,
                icon: require(`@/oil_card/assets/images/icon_${card.cardSpecId}.png`),
                bgImg: require(`@/oil_card/assets/images/card_lg_${card.cardSpecId}.png`),
                pro: pro,
                defaultChecked: false
            }));
            newcardChecked.push({id: card.cardSpecId, checked: card.activate > 0})
        });
        if (query.flag == 'login') { // 登录进入的时候汽油卡默认选中
            newcardChecked.map(card => {
                if (card.id == 1) card.checked = true;
                return newcardChecked;
            })
            newCardData.map(card => {
                if (card.cardSpecId == 1) card.defaultChecked = true;
                return newCardData;
            })
        }
        this.setState({newCardData, cardChecked: newcardChecked});
    }

    // 处理checkbox的状态变化
    handleChange = (cardSpecId, checked) => {
        const { cardChecked } = this.state;
        cardChecked.map(item => {
            if(item.id === cardSpecId) {
                item.checked = checked;
            }
            return item;
        });
        this.setState(cardChecked);
    };

    // 激活会员卡
    activate = () => {
        let cardSpecIds = [];
        const { cardChecked } = this.state;
        const {GetMemberInfoAction} = this.props;
        cardChecked.map(item => {
            if(item.checked === true) {
                cardSpecIds.push(item.id)
            }
            return cardSpecIds
        });
        if(cardSpecIds.length === 0) {
            Toast.fail('请选择加油卡', 2);
        } else {
            ActivationService.activationCard({cardSpecIds})
                .then((res) => {
                    Toast.success('激活成功', 2, () => {
                        // 更新会员信息
                        GetMemberInfoAction();
                        if (sessionStorage.getItem('JumpRoute')) { // 自动路由跳转
                            const JumpRoute = sessionStorage.getItem('JumpRoute');
                            sessionStorage.removeItem('JumpRoute');
                            this.props.history.push(JumpRoute);
                        } else { // 跳转首页
                            this.props.history.push('/app/home');
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    };
    
    render() {
        const {newCardData} = this.state;
        const {MerchantInfo} = this.props;

        return (
            <QueueAnim style={{height:'100%'}} type={['right', 'left']} delay={200} duration={1500} leaveReverse={true} forcedReplay={true}>
                <WingBlank size="md" key="activation">
                    <div className="activation-container">
                        <div className="field-box">
                            <Field imgSrc={select_oil_card} text="卡" customClass="define-field-class">
                                <div>请选择</div>
                            </Field>
                        </div>
                        <WhiteSpace size="sm" />
                        {
                            newCardData.map((oilCardData, index) => {
                                return (
                                    <OilCardActivation key={index} oilStation={MerchantInfo.name} oilCardData={oilCardData} handleChange={this.handleChange} />
                                )
                            })
                        }
                        <WhiteSpace size="xs" />
                        <MobileButton buttonClass="longButton" text="立即激活" handleClick={this.activate} />
                    </div>
                </WingBlank>
            </QueueAnim>
        );
    }
}

export default connect(state => ({
    MerchantInfo: state.MerchantInfo
}), {GetMemberInfoAction})(Activation);