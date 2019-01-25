/**
 * Field组件：快速构建一行字段
 *
 * 1. text: filed的文本（必填）
 * 2. customClass: 自定义类
 * 3. imgSrc: 图片url
 * 4. imgAlt: 图片提示
 * 5. subtext: 控制text文本需要显示不同字体大小或颜色的情况，如：积分明细和充值明细
 *
 */

import React, {Component} from 'react';
import PropTypes from "prop-types";
import classnames from 'classnames';

import './field.less'

class Field extends Component {
    // 指定props的数据类型
    static propTypes = {
        text: PropTypes.string.isRequired,
        subtext: PropTypes.string,
        customClass: PropTypes.string,
        imgSrc: PropTypes.string,
        imgAlt: PropTypes.string,
        handleClick: PropTypes.func
    };

    // 默认的props
    static defaultProps = {
        customClass: '',
        handleClick: () => {
        }
    };

    render() {
        const {
            imgSrc,
            imgAlt,
            text,
            customClass,
            subtext,
            children,
            handleClick
        } = this.props;

        const fieldClass = classnames('field', customClass);

        return (
            <div className={fieldClass} onClick={handleClick}>
                <div className="left-content">
                    {imgSrc ? (<img className="icon-img" src={imgSrc} alt={imgAlt} />) : (<div />)}
                    <div className="field-name">
                        {text}<span className="subtext">{subtext}</span>
                    </div>
                </div>
                <div className="right-content">
                    <div>{children}</div>
                </div>
            </div>
        );
    }
}

export default Field;