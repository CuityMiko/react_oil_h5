import React, { Component } from 'react';
import { WingBlank } from 'antd-mobile';

import MobileButton from '@/common/components/mobile_button/MobileButton';

import pay_error_icon from '@/common/components/error/assets/images/pay_error_icon.png';

class PayError extends Component {
    render () {
        return (
            <div className="pay-error-container">
                <img className="icon" src={pay_error_icon} alt="" />
                <div className="text">付款失败</div>
                <WingBlank size="md">
                    <MobileButton text="返回" handleClick={() => {console.log(111)}} customClass="longButton" />
                </WingBlank>
            </div>
        )
    }
}

export default PayError;