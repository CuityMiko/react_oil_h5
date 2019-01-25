/*
 * 我的油卡详情组件：OilCardDetail
 * props:
 *  1. oilCardType：油卡的种类，只能二选一，diesel（柴油卡）/petrol（汽油卡），必填
 *  2. oilStation：油站名称，必填
 *  3. applyGoods：适用油品，必填
 *  4. alreadyActivate：该卡是否已经激活，选填，默认为未激活状态
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {WingBlank, WhiteSpace} from 'antd-mobile'

import './oil_card_detail.less'

class OilCardDetail extends Component {
    static propTypes = {
        oilCardType: PropTypes.oneOf(['diesel', 'petrol']).isRequired,
        useRange: PropTypes.string,
        balance: PropTypes.number,
        customClass: PropTypes.string
    };

    // 默认的props
    static defaultProps = {
        customClass: ''
    };

    render() {
        const {
            oilCardType,
            useRange,
            balance,
            customClass,
        } = this.props;

        let oilCardClass = oilCardType === 'diesel' ? 'diesel-card' : 'petrol-card';
        let oilCardTitle = oilCardType === 'diesel' ? '柴油卡' : '汽油卡';

        const filedClass = classnames('oil-card', oilCardClass, customClass);

        return (
            <div className={filedClass}>
                <WhiteSpace size="sm" />
                <WingBlank size="sm">
                    <div className="card-title">{oilCardTitle}</div>
                    <div className="use-range">适用于{useRange}</div>
                    <div className="balance">余额：¥{Number(balance).toFixed(2)}</div>
                </WingBlank>
            </div>
        )
    }
}

export default OilCardDetail;