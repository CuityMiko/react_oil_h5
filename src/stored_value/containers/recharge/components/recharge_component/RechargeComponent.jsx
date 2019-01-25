/*
 * RechargeComponent组件：充值规则页面展示
 *
 * 1. rechargeItems：全部充值规则的数据源展示（必填）
 * 2. account：账户余额（必填）
 * 3. cardType：卡种类型，可选为petrol(汽油)/gas(柴油)（必填）
 * 4. rechargeIntro：充值说明（必填）
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WingBlank, Flex } from 'antd-mobile';

import Field from '@/common/components/field/Field';
import RechargeItem from '@/stored_value/containers/recharge/components/recharge_item/RechargeItem';

import petrol_trade from '@/base/assets/images/petrol_trade.png';
import gasoline_trade from '@/base/assets/images/gasoline_trade.png';
import recharge_icon from "@/stored_value/assets/images/recharge_icon.png";

import './recharge_component.less';

class RechargeComponent extends Component {
    static propTypes = {
        rechargeItems: PropTypes.array.isRequired,
        account: PropTypes.number.isRequired,
        cardType: PropTypes.oneOf(['gas', 'petrol']).isRequired,
        rechargeIntro: PropTypes.string.isRequired,
        handleClick: PropTypes.func,
        customInputChange: PropTypes.func
    };

    state = {
        // 默认第一个充值规则为选中的样式
        activeArr: [true]
    };

    componentDidMount() {

    }

    // 控制点击充值规则时的样式的切换
    handleClick = (index, id, amount) => {
        let _arr = [];
        _arr[index] = true;
        this.setState({
            activeArr: _arr
        });
        this.props.handleClick(id, amount);
        return _arr;
    };

    render() {
        const {
            activeArr
        } = this.state;

        const {
            rechargeItems,
            account,
            cardType,
            rechargeIntro,
            customInputChange
        } = this.props;
        return (
            <div className="recharge-component-container">
                <WingBlank size="sm">
                    <Field text="账户余额" imgSrc={cardType === 'gas'?gasoline_trade:petrol_trade} customClass="account-field">
                        <div>¥{account}</div>
                    </Field>
                </WingBlank>
                <div className="block"></div>
                <WingBlank size="sm">
                    <Field text="请选择充值金额" imgSrc={recharge_icon} customClass="recharge-field"></Field>
                    <div className="flex-wrap">
                        <Flex wrap="wrap" justify="between">
                            {
                                rechargeItems.map((rechargeItem, index) => {
                                    return (
                                        <RechargeItem customInputChange={customInputChange} isChecked={activeArr[index] === true} rechargeItem={rechargeItem} key={index} handleClick={(id, amount) => {this.handleClick(index, id, amount)}} />
                                    )
                                })
                            }
                        </Flex>
                    </div>
                    <div className="introduction">*充值说明：{rechargeIntro}</div>
                </WingBlank>
            </div>
        )
    }
}

export default RechargeComponent;