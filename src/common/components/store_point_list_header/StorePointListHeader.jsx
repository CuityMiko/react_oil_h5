/*
 * StorePointListHeader组件：用于积分明细和充值明细列表头部的展示
 *
 * 1. fieldImg: field组件的icon（必填）
 * 2. fieldText: field组件的text（必填）
 * 3. fieldSubtext: field组件的subtext（必填）
 * 4. buttonText: button组件的文本（必填）
 * 5. buttonClick: button组件的点击事件（必填）
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WingBlank, Icon } from 'antd-mobile';

import Field from '@/common/components/field/Field';
import MobileButton from '@/common/components/mobile_button/MobileButton';

class StorePointListHeader extends Component {
    static propTypes = {
        fieldImg: PropTypes.string.isRequired,
        fieldText: PropTypes.string.isRequired,
        fieldSubtext: PropTypes.string.isRequired,
        buttonText: PropTypes.string.isRequired,
        buttonClick: PropTypes.func.isRequired
    };

    arrowIcon = () => {
        return (
            <Icon type="right" size="xs" />
        )
    };

    render () {
        const {
            fieldImg,
            fieldText,
            fieldSubtext,
            buttonText,
            buttonClick
        } = this.props;

        return (
            <div className="store-point-list-header-container">
                <div className="header">
                    <WingBlank size="md">
                        <Field imgSrc={fieldImg} text={fieldText} subtext={fieldSubtext} customClass="field-class">
                            <MobileButton text={buttonText} icon={this.arrowIcon()} handleClick={buttonClick} buttonClass="businessButton" customClass="button-class" />
                        </Field>
                    </WingBlank>
                </div>
            </div>
        )
    }
}

export default StorePointListHeader;