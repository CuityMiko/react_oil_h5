/**
 * Card组件：用于登录及首页页面会员卡的展示
 *
 * 1.cardObj: {
 *       logo: 加油站的logo（必填）
 *       title: 加油站的名称（必填）
 *       phone: 会员手机号（必填）
 *       bgImg: 卡片背景图（选填） --默认为红色背景图
 *  }
 * 2. defineArea: 卡片最右侧提供自定义（选填）--默认为空
 */
import React, { Component } from 'react';
import PropTypes from "prop-types";

import default_bg from '@/common/components/card/assets/images/default_bg.png';
import default_head_img from '@/base/assets/images/default_head_img.png';

// 设置默认的cardObj
let defaultCardObj = {
    logo: default_head_img,
    title: '',
    phone: '***  ****  ****',
    bgImg: default_bg,
};

// 判断是否是默认的背景图，如果不是则加蒙层，并替换为黑色的阴影
let hasMask = false;

class Card extends Component {
    // 指定props的数据类型
    static propTypes = {
        cardObj: PropTypes.shape({
            logo: PropTypes.string,
            title: PropTypes.string,
            phone: PropTypes.string,
            bgImg: PropTypes.string,
        }),
        defineArea: PropTypes.element
    };

    // 默认的props
    static defaultProps = {
        cardObj: defaultCardObj
    };

    shouldComponentUpdate(nextProps) {
        const { cardObj } = nextProps;
        let _defaultCardObj = defaultCardObj;
        if(cardObj.bgImg && (cardObj.bgImg !== _defaultCardObj.bgImg)) {
            hasMask = true;
        }
        defaultCardObj = Object.assign({}, {..._defaultCardObj, ...cardObj});
        return true;
    }

    render () {
        const {
            logo,
            title,
            phone,
            bgImg
        } = defaultCardObj;

        const { defineArea } = this.props;

        const bgStyle = {
            backgroundImage: `url(${bgImg})`
        };

        return (
            <div className={hasMask ? 'card-container has-mask-shadow' : 'card-container div-shadow'} style={bgStyle}>
                <div className="top-content">
                    <div className="top-left-content">
                        <div className="logo">
                            <img src={logo} alt="" />
                        </div>
                        <div className="title">{title}</div>
                    </div>
                    <div className="card-detail">{defineArea}</div>
                </div>
                <div className="bottom-content">
                    <div className="member-id">会员ID</div>
                    <div className="phone">{phone}</div>
                </div>
                <div className={hasMask ? 'shadow-mask-top' : ''}></div>
                <div className={hasMask ? 'shadow-mask-bottom' : ''}></div>
            </div>
        )
    }
}

export default Card;