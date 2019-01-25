/*
 * StorePointListItem组件： 用于积分明细列表和充值明细列表下的item展示
 *
 * 1. item: 数据源（必填）
 *          - title: 文本
 *          - time: 时间
 *          - data: 右侧数据
 * 2. handleClick：点击item时进行的回调函数（必填）
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;

class StorePointListItem extends Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        handleClick: PropTypes.func.isRequired
    };

    getDataType = (data) => {
        if (data.indexOf('-') > -1) {
            return <span style={{color: '#ADADAD'}}>{data}</span>
        } else {
            return data
        }
    }

    render () {
        const {
            item,
            handleClick
        } = this.props;

        return (
            <div className="store-point-list-item-container">
                <Item arrow="horizontal" multipleLine extra={this.getDataType(item.data)} onClick={() => handleClick(item.id)}>
                    {item.title}
                    <Brief>交易时间：{item.time}</Brief>
                </Item>
            </div>
        )
    }
}

export default StorePointListItem;