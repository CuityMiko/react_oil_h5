import React, {Component} from 'react';
import {WhiteSpace, Flex, WingBlank} from 'antd-mobile';
import {connect} from 'react-redux';

import OilCardDetail from './components/oil_card_detail/OilCardDetail';
import Field from '@/common/components/field/Field';
import vipIcon from '@/oil_card/assets/images/vip_icon.png';
import storeIcon from '@/oil_card/assets/images/store_icon.png';
import consume from '@/oil_card/assets/images/consume.png';
import gasoline_trade from '@/base/assets/images/gasoline_trade.png';
import petrol_trade from '@/base/assets/images/petrol_trade.png';
import AddNewCard from './components/add_new_card/AddNewCard';
import addCardIcon from '@/oil_card/assets/images/add_card_icon.png';

import ActivationService from '@/oil_card/services/activation/activation.service';
import CardDetailService from '@/oil_card/services/detail/detail.service';

class OilDetail extends Component {
    state = {
        canActivationCards: [], // 可激活的卡种
        mbrActivationCards: [], // 会员激活的卡种
        currentCard: null, // 当前选中的卡种
        flagBool: true // 获取当前选择的卡种
    };

    componentDidMount() {
        document.title = '我的油卡';
        // 获取用户还可以激活的卡片列表
        ActivationService.getCardList().then(res => {
            if (res && res.length > 0) {
                let _res = res.filter(card => (card.activate < 1 && card.enable > 0));
                this.setState({
                    canActivationCards: _res
                });
            }
        })

        // 获取用户已经激活的卡种列表
        CardDetailService.findMbrHasCard().then(res => {
            if (res.mbrCardResponses && res.mbrCardResponses.length > 0) {
                let _result = res.mbrCardResponses.filter(card => card.activate > 0);
                if (_result.length > 0) {
                    this.bindCards(_result);
                }
            }
        })
    }

    /**
     * 绑定卡片
     */
    bindCards = (cards) => {
        if (cards != null && cards.length > 1) { // 排序
            cards = cards.sort((x, y) => x.specId - y.specId);
        }
        cards.map(async card => {
            await this.bindCardDetail(card);
        })
    }

    /**
     * 根据卡片ID获取卡片信息
     */
    async bindCardDetail(card) {
        try {
            const cardDetail = await CardDetailService.GetCardDetail(card.specId);
            const cardAmount = await CardDetailService.GetCardDetailAmount(card.cardId);
            const _proSkuDTOS = await CardDetailService.GetCardSpecPros(card.specId);
            let _sku = cardDetail.proSkuDTOS.filter(s=>s.skuName!=null).map(s=>s.skuName).join('/');
            if(_sku.length >= 10) {
                _sku = _sku.substring(0, 10).concat('...');
            }
            let carddetail = {
                id: card.specId,
                name: card.specName,
                balance: cardDetail.balance, // 余额
                sku: _sku, // sku
                totalDiscount: cardAmount !=null ? cardAmount.totalDiscount : 0, // 折扣总额
                totalScore: cardAmount !=null ? cardAmount.totalScore : 0, // 积分总额
                totalUse: cardAmount !=null ? cardAmount.totalUse : 0, // 使用总额
                proSkuDTOS: _proSkuDTOS,
                open: card.specId == 1 ? true : false
            };
            let {mbrActivationCards} = this.state;
            mbrActivationCards.push(carddetail);
            if (mbrActivationCards != null && mbrActivationCards.length > 1) { // 排序
                mbrActivationCards = mbrActivationCards.sort((x, y) => x.id - y.id);
            }
            this.setState({mbrActivationCards});
        } catch (error) {
        }
    }

    /**
     * 效果切换
     */
    changeShow = (e, cardid) => {
        e.preventDefault();
        const {mbrActivationCards} = this.state;
        let {flagBool, currentCard} = this.state;
        if(mbrActivationCards.length > 1){
            flagBool = !flagBool;
        }
        currentCard = mbrActivationCards[(flagBool ? 0 : 1)];
        currentCard.open = !currentCard.open;
        let _tempdata = mbrActivationCards.filter(card => card.id != currentCard.id);
        if (_tempdata != null && _tempdata.length > 0) {
            _tempdata.map(c => c.open = !currentCard.open);
        }
        _tempdata.push(currentCard);
        _tempdata = _tempdata.sort((x, y) => x.id - y.id)
        this.setState({
            currentCard,
            flagBool,
            mbrActivationCards: _tempdata
        });
    };

    /**
     * 添加卡片
     */
    AddCard = (e) => {
        e.preventDefault();
        this.props.history.push('/app/oilcard/activation');
    };

    /**
     * 暂无其他卡片时操作
     */
    noCard = (e) => {
        e.preventDefault();
    };

    /**
     * 绑定头部
     */
    bindHeaderCard = () => {
        const {mbrActivationCards, canActivationCards} = this.state;
        if (mbrActivationCards != null && mbrActivationCards.length > 1) {
            return (
                <Flex>
                    {
                        mbrActivationCards.map((card, index) => {
                            return (
                                <Flex.Item key={index}>
                                    <div className="position-relative"
                                         onClick={(e) => {this.changeShow(e, card.id)}}
                                    >
                                        <OilCardDetail oilCardType={card.id == 1 ? 'petrol' : 'diesel'} customClass={card.open ? 'showCard' : 'hideCard'} useRange={card ? card.sku : ''} balance={card ? card.balance : ''} />
                                    </div>
                                </Flex.Item>
                            )
                        })
                    }
                </Flex>
            )
        } else {
            return (
                <Flex>
                    <Flex.Item>
                        <div className="position-relative">
                            <OilCardDetail oilCardType={mbrActivationCards[0].id == 1 ? 'petrol' : 'diesel'} customClass="showCard" useRange={mbrActivationCards[0].sku} balance={mbrActivationCards[0].balance} />
                        </div>
                    </Flex.Item>
                    <Flex.Item>
                        <div className="position-relative">
                            <AddNewCard customClass="add-hideCard"
                                        imgSrc={canActivationCards.length>0?addCardIcon:''}
                                        text={canActivationCards.length>0?'添加卡':'暂无其他油卡'}
                                        onClick={canActivationCards.length>0?this.AddCard:this.noCard}
                            />
                        </div>
                    </Flex.Item>
                </Flex>
            )
        }
    }

    bindContent = (currentCard) => {
        return (
            <div>
                <div className="card-content">
                    <WingBlank size="sm">
                        {this.bindHeaderCard()}
                    </WingBlank>
                    <div className="save-content">
                        <WingBlank size="sm">
                            <div>
                                <Field imgSrc={vipIcon} text={currentCard != null ? `办理${currentCard.name}会员` : ''}>
                                    <div>已累计为您节省了¥{currentCard != null ? Number(currentCard.totalDiscount).toFixed(2) : '0'}</div>
                                </Field>
                            </div>
                        </WingBlank>
                    </div>
                    <div className="data-content">
                        <WingBlank size="sm">
                            <WhiteSpace />
                            <Flex>
                                <Flex.Item>
                                    <Field imgSrc={storeIcon} text="累计积分" customClass="cumulative-data">
                                        <div>
                                            {currentCard != null ? currentCard.totalScore : '0'}
                                        </div>
                                    </Field>
                                </Flex.Item>
                                <Flex.Item>
                                    <Field imgSrc={consume} text="累计消费" customClass="cumulative-data">
                                        <div>
                                            ¥{currentCard != null ? Number(currentCard.totalUse).toFixed(2) : '0'}
                                        </div>
                                    </Field>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace size="md" />
                            <div className="oil-price-content">
                                <Field imgSrc={currentCard != null && currentCard.id == 1 ? petrol_trade : gasoline_trade} text={currentCard != null && currentCard.id == 1 ? '汽油油品' : '柴油油品'} customClass="oil-price-content-header" />
                                <WhiteSpace size="sm" />
                                <Flex className="price-list price-list-tit">
                                    <Flex.Item className="left">油品名称</Flex.Item>
                                    <Flex.Item className="center">单价</Flex.Item>
                                    <Flex.Item className="right">优惠价</Flex.Item>
                                </Flex>
                                {
                                    currentCard.proSkuDTOS.map((sku, index) => {
                                        return (
                                            <Flex className="price-list price-list-item" key={index}>
                                                <Flex.Item className="left">{sku.oilName.length>5?(sku.oilName.substr(0,5).concat('...')):sku.oilName}</Flex.Item>
                                                <Flex.Item className="center">¥{Number(sku.perAmount).toFixed(2)}/L</Flex.Item>
                                                <Flex.Item className="right">{sku.activityAmount || sku.activityAmount > 0 ? `¥${Number(sku.activityAmount).toFixed(2)}/L` : '-'}</Flex.Item>
                                            </Flex>
                                        )
                                    })
                                }
                            </div>
                        </WingBlank>
                    </div>
                </div>
            </div>
        )
    }

    /**
     * 绑定内容体
     */
    bindBody = () => {
        const {currentCard, mbrActivationCards} = this.state;
        if (currentCard != null && currentCard != undefined) {
            return this.bindContent(currentCard);
        } else {
            if (mbrActivationCards != null && mbrActivationCards.length > 0) {
                return this.bindContent(mbrActivationCards[0]);
            } else {
                return (
                    <div></div>
                )
            }
        }
    }

    render() {
        return (
            <div className="card-detail">
                {this.bindBody()}
            </div>
        );
    }
}

export default connect(state => ({}),{})(OilDetail);