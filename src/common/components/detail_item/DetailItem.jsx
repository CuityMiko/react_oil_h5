/*
 * DetailItem组件：用于卡券详情/提货码详情中展示key/value的键值对
 *
 * props:
 *  1. detailItems: map结构，[key, value]，必填
 *  2. customClass: 提供自定义的样式类
 *  2. 提供children，可以传入Field组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class DetailItem extends Component {
    static propTypes = {
        detailItems: PropTypes.object.isRequired,
        customClass: PropTypes.string
    };

    render() {
        const {
            detailItems,
            customClass,
            children
        } = this.props;

        const detailItemClass = classnames('detail-items-container', customClass);

        return (
            <div className={detailItemClass}>
                {children}
                {
                    [...detailItems].map((detailItem, index) => {
                        return (
                            (detailItem[0] === '' || detailItem[0].indexOf('--') === 0) ? (
                                <div className="introduction-item-box" key={index}>
                                    {detailItem[1]}
                                </div>
                            ) : (
                                <div className="info-item-box" key={index}>
                                    <div className="name">{detailItem[0]}</div>
                                    <div className="data">{detailItem[1]}</div>
                                </div>
                            )
                        )
                    })
                }
            </div>
        )
    }
}

export default DetailItem;