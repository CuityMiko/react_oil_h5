/*
 * RechargeItem组件：用于充值规则item的展示
 *
 * 1. rechargeItem：单条充值规则的数据（必填）
 * 2. handleClick：用于切换充值规则时进行的回调函数（必填）
 * 3. isChecked：判断充值规则是否被选中，选中时加上样式（必填）
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { createForm } from 'rc-form';
import { List, InputItem } from 'antd-mobile';
import {connect} from 'react-redux';

import gift from '@/base/assets/images/gift.png';

import './recharge_item.less';

class RechargeItem extends Component {
    static propTypes = {
        rechargeItem: PropTypes.object.isRequired,
        handleClick: PropTypes.func.isRequired,
        isChecked: PropTypes.bool.isRequired,
        customInputChange: PropTypes.func
    };

    state = {
        active: false,
        account: ''
    };

    componentDidMount() {
    }

    // 判断显示赠送的类型
    // 后端字段还未给出，暂定type: 1-送积分  2-送充值  3-送卡券
    judge = (item) => {
        switch (item.type) {
            case 1:
                return (
                    <div className="score-recharge">
                        <img src={gift} alt="" />
                        <div className="text">送{item.value}积分</div>
                    </div>
                );
            case 2:
                return (
                    <div className="score-recharge">
                        <img src={gift} alt="" />
                        <div className="text">送￥{item.value}元</div>
                    </div>
                );
            case 3: return (
                <div className="coupon-recharge">
                    <div className="coupon-before"></div>
                    <div className="coupon-content">送{item.value.length>7?(item.value.substr(0, 7).concat('...')):item.value}</div>
                    <div className="coupon-after"></div></div>
            );
            default:
                break;
        }
    };

    handleClick = (id, amount) => {
        this.props.handleClick(id, amount);
        this.setState((prevState) => {
            return {
                active: !prevState.active
            }
        })
    };

    inputChange = (val) => {
        this.setState({account: val}, () => {
            this.props.customInputChange(val);
        });
    };

    // 修复ios收起键盘后高度不回落问题
    onBlur = () => {
        const {inputXY} = this.props;
        if (inputXY) {
            window.scroll(inputXY.data.x, inputXY.data.y);
        } else {
            window.scroll(0, 0);
        }
    };

    render() {
        const {
            rechargeItem,
            isChecked,
            form
        } = this.props;

        const { getFieldProps } = form;

        const {account, moneyKeyboardWrapProps} = this.state;

        const containerClass = classnames('recharge-item-container', {
            'recharge-item-command-container': rechargeItem.flag === 1,
            'recharge-item-active-container': isChecked
        });

        return (
            <div className={containerClass} onClick={() => {this.handleClick(rechargeItem.id, rechargeItem.amount)}}>
                {
                    // 在后端传回充值规则的列表后，手动向数据源追加一条数据，并把里面的defineRecharge设为true
                    rechargeItem.defineRecharge ? (
                        <div className="wrap">
                            <div className="define-recharge-title">其他金额</div>
                            <List>
                                <InputItem
                                    {...getFieldProps('digit')}
                                    type="digit"
                                    placeholder="请输入充值金额"
                                    value={account}
                                    onChange={this.inputChange}
                                    onBlur={this.onBlur}
                                />
                            </List>
                        </div>
                    ) : (
                        <div className="wrap">
                            <div className="title">充值</div>
                            <div className="amount"><span>￥</span>{rechargeItem.amount}</div>
                            {this.judge(rechargeItem)}
                        </div>
                    )
                }
            </div>
        )
    }
}

export default connect(state => {
    const inputXY = state.AppData.inputXY;
    return {
        inputXY
    }
}, {})(createForm()(RechargeItem));