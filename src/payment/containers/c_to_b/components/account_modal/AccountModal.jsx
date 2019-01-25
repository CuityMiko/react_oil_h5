import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Field from '@/common/components/field/Field';
import MobileButton from '@/common/components/mobile_button/MobileButton';

import account_modal_icon from '@/payment/assets/images/account_modal_icon.png';
import close_icon from '@/payment/assets/images/close_icon.png';

import './account_modal.less';

class AccountModal extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        payAmount: PropTypes.any, // 支付金额
        availableAmount: PropTypes.any, // 卡片余额
        handleClick: PropTypes.func
    };

    defaultProps = {
        handleClick: () => {}
    }

    render() {
        const {
            onClose,
            payAmount,
            availableAmount,
            handleClick
        } = this.props;

        return (
            <div className="account-modal-container">
                <img className="close-icon" src={close_icon} onClick={onClose} alt="" />
                <div className="header">
                    <img className="icon" src={account_modal_icon} alt="" />
                    <div className="account-title">账户余额不足</div>
                </div>
                <div className="content">
                    <Field text="需付款" customClass="field-class color">
                        <div>¥{payAmount}</div>
                    </Field>
                    <Field text="当前余额" customClass="field-class">
                        <div>¥{availableAmount}</div>
                    </Field>
                </div>
                <div className="footer">
                    <MobileButton text="前往充值" buttonClass="longButton"
                                  customClass="go-recharge-button"
                                  handleClick={handleClick}
                    />
                </div>
            </div>
        )
    }
}

export default AccountModal;