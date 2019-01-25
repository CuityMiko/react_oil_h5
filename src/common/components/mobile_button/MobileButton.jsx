/**
 * MobileButton组件： 按钮组件
 *
 * 1. text: 按钮的文本（必填）
 * 2. handleClick: 点击按钮出发的回调事件（必填）
 * 3. buttonClass: 按钮的样式类（必填）
 *                  - longButton: 橙色长按钮 eg:立即激活，立即使用
 *                  - emptyButton: 中空长按钮 eg:快速充值
 *                  - shortButton: 橙色小按钮 eg:去使用
 *                  - businessButton: 业务按钮  eg:积分须知，前往充值
 * 4. disabled: 按钮是否可用（选填）--默认为false，可用
 * 5. isRound: 按钮是否是圆角（选填）--默认为true，25px的圆角弧度
 * 6. icon: 按钮的右侧放置icon（选填）
 * 7.customClass: 按钮的自定义的class类（选填）
 */
import React, { Component } from 'react';
import PropTypes from "prop-types";
import classnames from 'classnames';

class MobileButton extends Component {
    // 指定props的数据类型
    static propTypes = {
        text: PropTypes.string.isRequired,
        handleClick: PropTypes.func.isRequired,
        buttonClass: PropTypes.oneOf(['longButton', 'emptyButton', 'shortButton', 'businessButton']),
        disabled: PropTypes.bool,
        icon: PropTypes.element,
        isRound: PropTypes.bool,
        customClass: PropTypes.string
    };

    // 默认的props
    static defaultProps = {
        disabled: false,
        icon: null,
        isRound: true,
        customClass: ''
    };

    render() {
        const {
            handleClick,
            text,
            buttonClass,
            disabled,
            icon,
            isRound,
            customClass
        } = this.props;

        const btnClass = classnames('button', buttonClass, {
            disabled: disabled,
            square: !isRound
        }, customClass);

        return (
            <div className="button-container">
                <button className={btnClass} onClick={handleClick}>
                    {text}
                    {icon}
                </button>
            </div>
        );
    }
}

export default MobileButton;