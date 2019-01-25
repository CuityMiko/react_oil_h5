/*
 * BottomContent组件： 适用于固定在屏幕底部的content，如提货码页面下方的立即兑换
 *
 * props:
 *      1. buttonIsBehind: 按钮是在前部还是在后部，默认在后部，如果按钮在前部则传入false, 选填
 *      2. customClass：提供自定义样式类
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class BottomContent extends Component {
    static propTypes = {
        buttonIsBehind: PropTypes.bool,
        customClass: PropTypes.string
    };

    static defaultProps = {
        buttonIsBehind: true
    };

    render() {

        const {
            buttonIsBehind,
            customClass,
            children
        } = this.props;

        const bottomContentClass = classnames('bottom-content-container', customClass);

        const style = {
            flexDirection: buttonIsBehind === true ? 'row' : 'row-reverse'
        };

        return (
            <div className={bottomContentClass} style={style}>
                {children}
            </div>
        )
    }
}

export default BottomContent;