/*
 * StorePointDetail组件： 用于积分明细详情以及充值明细详情的展示
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { WhiteSpace, WingBlank } from 'antd-mobile';

import Field from '@/common/components/field/Field';
import MobileButton from '@/common/components/mobile_button/MobileButton';

import alipay from '@/common/components/store_point_detail/assets/alipay.png';
import member_card_pay from '@/common/components/store_point_detail/assets/member_card_pay.png';
import wechat from '@/base/assets/images/wechat.png';
import gasoline_trade from '@/base/assets/images/gasoline_trade.png';
import petrol_trade from '@/base/assets/images/petrol_trade.png';

class StorePointDetail extends Component {
    static propTypes = {
        type: PropTypes.oneOf(['point', 'store']),
        number: PropTypes.number,
        itemsMap: PropTypes.object.isRequired,
        history: PropTypes.object
    };

    handleClick = () => {
        this.props.history.push('/app/home');
    };

    // 判断icon的显示
    judgeDisplay = (key, value) => {
        if(key === '交易方式') {
            return (
                <div className="field-right-content">
                    <img className="field-icon" src={value.indexOf('支付宝') > -1 ? alipay : (value.indexOf('微信') > -1 ? wechat : member_card_pay)} alt="" />
                    <div>{value}</div>
                </div>
            )
        } else if(key === '交易油卡') {
            return (
                <div className="field-right-content">
                    <img className="field-icon" src={value === '汽油卡'?petrol_trade:gasoline_trade} alt="" />
                    <div>{value}</div>
                </div>
            )
        }
        else {
            return value;
        }
    };

    render() {
        const {itemsMap, number, type} = this.props;
        // 根据积分的增加或者减少判断显示积分的颜色（根据后端传回的type值判断）
        const titleClass = classnames('title', {
            'jianshao': number <= 0
        });
        return (
            <div className="grey-back store-point-detail-container">
                <div className="content">
                    <WhiteSpace size="lg" />
                    {
                        type == 'point' ? (
                            <div className={titleClass}>{number > 0 ? `+${number}` : number}<span className="small">积分</span></div>
                        ) : (
                            <div className={titleClass}>{number > 0 ? `+${Number(number).toFixed(2)}` : Number(number).toFixed(2)}<span className="small">元</span></div>
                        )
                    }
                    <WhiteSpace size="lg" />
                    <WingBlank size="sm">
                        {
                            [...itemsMap].map((item, index) => {
                                return (
                                    <Field text={item[1][0]} key={index}
                                           customClass={`store-point-detail-field ${(item[1][0] === '交易类型') ||(item[1][0] === '赠送优惠券/赠送金额/积分') ?'field-border':''}`}
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
                    <MobileButton text="返回首页" buttonClass="longButton" handleClick={this.handleClick} />
                </WingBlank>
            </div>
        )
    }
}

export default StorePointDetail;