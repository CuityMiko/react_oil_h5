import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WingBlank, WhiteSpace, Radio } from 'antd-mobile';

import Field from '@/common/components/field/Field';
import MobileButton from '@/common/components/mobile_button/MobileButton';
import CouponComponent from '@/common/components/coupon_component/CouponComponent';

import './select_coupon_popup.less';

const RadioItem = Radio.RadioItem;

class SelectCouponPopup extends Component {
    static propTypes = {
        getCouponClick: PropTypes.func.isRequired, // 点击确定按钮或者是点击任性，不使用优惠券关闭弹窗
        couponData: PropTypes.array.isRequired, // 优惠券数据
        isReset: PropTypes.bool, // 重置
        code: PropTypes.string // 卡券核销码
    };

    state = {
        // 判断卡券是否被选中
        value: '',
        amount: 0
    };

    componentWillReceiveProps(newProps) {
        if (newProps.isReset) {
            this.setState({value: '', amount: 0});
        } else {
            this.setState({value: newProps.code});
        }
    }

    onChange = (value, amount) => () => {
        this.setState({
            value,
            amount
        })
    };

    /**
     * 点击确定按钮
     */
    buttonClick = () => {
        const {value, amount} = this.state;
        this.props.getCouponClick(value, amount);
    }

    /**
     * 不选择
     */
    noSelect = () => {
        this.setState({
            value: '',
            amount: 0
        }, () => {
            this.props.getCouponClick('', 0)
        })
    }

    render() {
        const {
            value
        } = this.state;

        const {
            payAmount,
            couponData,
            isReset,
            code,
        } = this.props;

        return (
            <div className="grey-back select-coupon-popup-container">
                <Field text="选择优惠券" customClass="select-coupon-field">
                    <MobileButton text="确定" buttonClass="shortButton"
                                  customClass="sure-button"
                                  handleClick={this.buttonClick}
                    />
                </Field>
                <WhiteSpace size="xs" />
                <WingBlank size="sm">
                    <div className="not-use-coupon" onClick={this.noSelect}>任性，不使用优惠券</div>
                    <div className="coupon-content">
                        {
                            couponData.map((couponItem, index) => {
                                return (
                                    <CouponComponent couponItem={couponItem}
                                                     key={index}
                                    >
                                        <RadioItem key={couponItem.code}
                                            checked={value == '' ? code == couponItem.code : value == couponItem.code}
                                            onChange={this.onChange(couponItem.code, couponItem.amount)}
                                        />
                                    </CouponComponent>
                                )
                            })
                        }
                    </div>
                </WingBlank>
            </div>
        )
    }
}

export default SelectCouponPopup