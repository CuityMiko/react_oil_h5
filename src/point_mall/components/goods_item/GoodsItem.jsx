/*
 * GoodsItem组件： 用于积分商城以及我的提货码页面展示
 *
 * props:
 *      1. goodsItem
 *          - name: 商品名称，必填
 *          - money: 商品的价格，必填
 *          - score: 兑换商品所需积分，必填
 *      2. useScene: 使用场景，mallList-积分商城  myDeliveryCodeNotUse-我的提货码未使用，myDeliveryCodeHasUsed-我的提货码已使用
 *      3. handleClick: 点击组件进行的回调
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WingBlank } from 'antd-mobile';
import LazyLoad from 'react-lazyload';
import {connect} from 'react-redux';

import MobileButton from '@/common/components/mobile_button/MobileButton';
import score_has_used_sm from '@/point_mall/assets/images/score_has_used_sm.png';
import defaultImage from '@/point_mall/assets/images/image_default.png';

import './goods_item.less';

class GoodsItem extends Component {
    static propTypes = {
        goodsItem: PropTypes.object.isRequired,
        useScene: PropTypes.oneOf(['mallList', 'myDeliveryCodeNotUse', 'myDeliveryCodeHasUsed']).isRequired,
        handleClick: PropTypes.func.isRequired,
        redeemClick: PropTypes.func.isRequired // 兑换 / 去使用
    };

    // 根据useScene来判断按钮以及icon的显示
    judge = (useScene, goodsItem, myScore, redeemClick) => {
        switch (useScene) {
            // 积分商城
            case 'mallList':
                return (
                    <div>
                        <div className="money">¥{goodsItem.money}</div>
                        <div className="mall-list-box">
                            <div className="point"><span className="bigger">{goodsItem.score}</span>积分</div>
                            <MobileButton text={myScore >= goodsItem.score ? '立即兑' : '积分不足'}
                                          buttonClass="shortButton"
                                          disabled={myScore < goodsItem.score}
                                          handleClick={() => {redeemClick(goodsItem.id)}}
                            />
                        </div>
                    </div>
                );
            // 我的提货码-未使用
            case 'myDeliveryCodeNotUse':
                return (
                    <div>
                        <div className="delivery-code-box">
                            <div className="money">¥{goodsItem.money}</div>
                            <MobileButton text="去使用" buttonClass="shortButton" handleClick={() => {redeemClick(goodsItem.id)}} />
                        </div>
                    </div>
                );
            // 我的提货码-已使用
            case 'myDeliveryCodeHasUsed':
                return (
                    <div>
                        <div className="delivery-code-box">
                            <div className="money">¥{goodsItem.money}</div>
                        </div>
                        <img className="has-used-icon" src={score_has_used_sm} alt="" />
                    </div>
                );
            default:
                break;
        }
    };

    render() {
        const {
            goodsItem,
            useScene,
            handleClick,
            redeemClick,
            MemberInfo
        } = this.props;
        let myScore = MemberInfo && MemberInfo.availableScore ? MemberInfo.availableScore : 0;
        return (
            <div className="animated fadeIn goods-item-container">
                <div className="item-box">
                    <div className="display-item-box" onClick={handleClick}>
                        <LazyLoad height={330} offset={100}>
                            <img src={goodsItem !=null && (goodsItem.imgUrl !='' || goodsItem.imgUrl != null) ? goodsItem.imgUrl : defaultImage}/>
                        </LazyLoad>
                    </div>
                    <div className="bottom-content">
                        <WingBlank size="sm">
                            <div className="name">{(goodsItem.name && goodsItem.name.length > 8) ? (goodsItem.name.substring(0, 8).concat('...')) : goodsItem.name}</div>
                            {this.judge(useScene, goodsItem, myScore, redeemClick)}
                        </WingBlank>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    MemberInfo: state.MemberInfo
}),{})(GoodsItem);