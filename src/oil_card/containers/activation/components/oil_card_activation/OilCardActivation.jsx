/*
 * 激活油卡组件：OilCardActivation
 * props:
 *  1. oilStation：油站名称，必填
 *  2. handleChange：处理checkbox的状态变化，必填
 *  3. oilCardData：油卡展示数据
 *          - cardSpecId：卡种id 1-汽油卡 2-柴油卡
 *          - name：卡种名称
 *          - activate：是否已激活 0-未激活 1-激活
 *          - icon：卡片icon
 *          - bgImg：卡片背景图
 *          - pro：卡片的适用油品
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { WingBlank, Checkbox } from 'antd-mobile';

import already_activate from '@/oil_card/assets/images/already-activate.png';

import './oil_card_activation.less'

const CheckboxItem = Checkbox.CheckboxItem;

class OilCardActivation extends Component {
    static propTypes = {
        oilStation: PropTypes.string.isRequired,
        oilCardData: PropTypes.object.isRequired,
        handleChange: PropTypes.func.isRequired
    };

    // checkbox状态改变的事件
    onChange = (e, cardSpecId) => {
        const { handleChange } = this.props;
        handleChange(cardSpecId, e.target.checked);
    };

    render () {
        const {
            oilStation,
            oilCardData
        } = this.props;

        return (
            <div className="oil-card-activation-container">
                <div className="oil-card-box" style={{backgroundImage: `url(${oilCardData.bgImg})`, boxShadow: oilCardData.cardSpecId===2?'0 8px 20px 0 rgba(255,162,0,0.2)':'0 9px 25px 0 rgba(254,216,200,1)'}}>
                    <WingBlank size="md">
                        <div className="content">
                            <div className="left-content">
                                <div className="title">
                                    <img className="title-icon" src={oilCardData.icon} alt="" />
                                    <div className="title-text">{oilCardData.name}</div>
                                </div>
                                <div className="oil-station">{oilStation}加油站</div>
                                <div className="apply-goods">适用于{oilCardData.pro}</div>
                            </div>
                            <div className="right-content">
                                {
                                    oilCardData.activate === 1 ? (
                                        <img className="already-activate" src={already_activate} alt="" />
                                    ) : (
                                        <CheckboxItem defaultChecked={oilCardData.defaultChecked} onChange={(e) => this.onChange(e, oilCardData.cardSpecId)}></CheckboxItem>
                                    )
                                }
                            </div>
                        </div>
                    </WingBlank>
                </div>
                {
                    <style>
                        {
                            `.am-list-item {
                                background-color: transparent;
                                padding-left: 0;
                            }
                            
                            .am-list-item .am-list-thumb:first-child {
                                margin-right: 0;
                            }
                            
                            .am-list-item .am-list-line {
                                display: none;
                            }`
                        }
                    </style>
                }
            </div>
        )
    }
}

export default OilCardActivation;