/*
 * LeftCouponComponent组件：用于卡券左边部分的展示
 *
 * 1. couponItem：卡券的数据（必填）
 *      - amount：卡券金额
 *      - leastCost：满xxx可用
  *     - name：卡券名称
 *      - date：有效日期
 *      - applyGoods：适用油品
 * 2. customClass：提供修改样式
 * 3. handleClick: 点击卡券左边部分进行的回调函数
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class LeftCouponComponent extends Component {
    static propTypes = {
        couponItem: PropTypes.object.isRequired,
        customClass: PropTypes.string,
        handleClick: PropTypes.func
    };

    render() {
        const {
            couponItem,
            customClass,
            handleClick
        } = this.props;

        const {
            amount,
            leastCost,
            name,
            date,
            applyGoods,
            payType
        } = couponItem;

        const containerClass = classnames('left-coupon-component-container', customClass);

        return (
            <div className={containerClass} onClick={handleClick}>
                <div className="left-content">
                    <div className="left-left-content">
                        <div className="left-left-box">
                            <div className="money-box">
                                <div className="money">{amount}</div>
                            </div>
                            <div className="apply-conditions-box">
                                <div className="apply-conditions">{leastCost === 0 ? '任意金额': `满¥${leastCost}元`}可用</div>
                            </div>
                        </div>
                    </div>
                    <div className="left-right-content">
                        <div className="left-right-box">
                            <div className="name">{name ? name.length > 7 ? name.substring(0,7).concat('...') : name : ''}</div>
                            <div className="item date">有效日期：{date}</div>
                            <div className="item date">适用油品：{applyGoods ? applyGoods.length > 7 ? applyGoods.substring(0,7).concat('...') : applyGoods : ''}</div>
                            {
                                payType ? <div className="item">{payType}</div> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LeftCouponComponent;