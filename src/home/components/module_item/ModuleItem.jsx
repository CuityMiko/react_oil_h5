/*
 * ModuleItem组件：用于首页最下端的module模块展示
 * props:
 *  1.moduleItems:类型为[{icon, text, path}], 选填，已设置默认的props数据
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Grid } from 'antd-mobile';

import coupon_square from '@/home/assets/images/coupon_square.png';
import my_delivery_code from '@/home/assets/images/my_delivery_code.png';
import my_information from '@/home/assets/images/my_information.png';
import my_oil_card from '@/home/assets/images/my_oil_card.png';
import score_mall from '@/home/assets/images/score_mall.png';

import './module_item.less'

class ModuleItem extends Component {
    static propTypes = {
        moduleItems: PropTypes.array,
        history: PropTypes.object
    };

    static defaultProps = {
        moduleItems: [
            {
                icon: my_oil_card,
                text: '我的油卡',
                path: '/app/member/detail'
            },
            {
                icon: coupon_square,
                text: '卡券广场',
                path: '/app/coupon/list'
            },
            {
                icon: score_mall,
                text: '积分商城',
                path: '/app/mall/list'
            },
            {
                icon: my_delivery_code,
                text: '我的提货码',
                path: '/app/mall/delivery_code'
            },
            {
                icon: my_information,
                text: '我的信息',
                path: '/app/my-info'
            }
        ]
    };

    render () {
        const {
            moduleItems,
            history
        } = this.props;


        return (
            <div className="module-item-container">
                <Grid data={moduleItems} activeStyle={false} columnNum={3} hasLine={false} onClick={_el => (history.push(_el.path))} />
            </div>
        )
    }
}

export default ModuleItem;