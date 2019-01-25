/*
 * DetailBanner组件： 用于积分兑换码详情头部的展示
 *
 *  1. name:商品名称，必填
 *  2. img:商品图片，必填
 *  3. children:可以传入field组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { WingBlank } from 'antd-mobile';

import './detail_banner.less';

class DetailBanner extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired
    };

    render() {
        const {
            name,
            img,
            children
        } = this.props;

        const style = {
            backgroundImage: `url(${img})`
        };

        return (
            <div className="detail-banner-container" style={style}>
                <WingBlank size="sm">
                    <div>
                        <div className="name">{name}</div>
                        {children}
                    </div>
                </WingBlank>
                <div className="mask"></div>
            </div>
        )
    }
}

export default DetailBanner;