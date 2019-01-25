/*
 * BorderItem组件： 用于兑换油站及积分须知弹窗前面带border的标题展示
 *
 * 1. text: 标题，必填
 * 2. customClass：提供自定义样式类，比如可用于改变title的样式
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class BorderItem extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        customClass: PropTypes.string
    };

    render() {
        const {
            text,
            customClass
        } = this.props;

        const borderItemClass = classNames('border-items-container', customClass)

        return (
            <div className={borderItemClass}>
                <div className="border"></div>
                <div className="item">{text}</div>
            </div>
        )
    }
}

export default BorderItem;