/*
 * CouponComponent组件：用于卡券形式的展示
 *
 * 1. couponItem：用于传给LeftCouponComponent组件的数据源
 * 2. useScene：适用场景，默认为coupon,可选为：gift-coupon：赠送卡券
 *                                           share-coupon：分享卡券
 *                                           invalid-coupon：卡券已作废
 * 3. customClass: 提供左侧自定义样式类
 * 4. handleClick: 点击卡券左边部分进行的回调函数
 * 5. children：提供卡券组件右边内容的展示，四种场景中，只有share-coupon场景右边内容为空，无需传children
 * 注：四种卡券的使用场景的样式背景图等已经封装
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import LeftCouponComponent from "@/common/components/left_coupon_component/LeftCouponComponent";

class CouponComponent extends Component {
    static propTypes = {
        couponItem: PropTypes.object.isRequired,
        useScene: PropTypes.oneOf(['coupon', 'gift-coupon', 'share-coupon', 'invalid-coupon']),
        customClass: PropTypes.string,
        handleClick: PropTypes.func
    };

    static defaultProps = {
        useScene: 'coupon'
    };

    render() {
        const {
            useScene,
            couponItem,
            customClass,
            handleClick,
            children
        } = this.props;

        const containerClass = classnames('coupon-component-container', {
            'coupon-component-container-gift': useScene === 'gift-coupon',
            'coupon-component-container-share': useScene === 'share-coupon',
            'coupon-component-container-invalid': useScene === 'invalid-coupon'
        }, customClass);

        return (
            <div className={containerClass}>
                <div className="left-coupon-component-box">
                    <LeftCouponComponent customClass="gift-coupon invalid-coupon" couponItem={couponItem} handleClick={handleClick} />
                </div>
                {
                    useScene === 'share-coupon' ? (
                        <div></div>
                    ) : (
                        <div className="right-content">
                            {children}
                        </div>
                    )
                }
            </div>
        )
    }
}

export default CouponComponent;