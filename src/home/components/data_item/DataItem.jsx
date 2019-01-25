/*
 * 首页的数据展示组件: DataItem
 *
 * 1. dataItems: 即需要展示的数据源，类型为嵌套的map组合（必填）
 * 形式为：[['汽油卡', '￥500.00'], func]
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Flex } from 'antd-mobile';

import './data_item.less';

class DataItem extends Component {
    // 指定props的数据类型
    static propTypes = {
        dataItems: PropTypes.object
    };

    render() {
        const { dataItems } = this.props;

        return (
            <div className="data-item-container">
                <Flex>
                    <Flex.Item>
                        <Flex>
                            {
                                [...dataItems].map((item, index) => {
                                    return (
                                        <div className="data-item-box" key={index} onClick={item[1]}>
                                            {[...item[0]].map((childItem, index) => {
                                                return (
                                                    <div className="data-item" key={index}>
                                                        <div className="text">{childItem[0]}</div>
                                                        <div className="data">{childItem[1]}</div>
                                                    </div>
                                                )}
                                            )}
                                        </div>
                                    )
                                })
                            }
                        </Flex>
                    </Flex.Item>
                </Flex>
            </div>
        )
    }
}

export default DataItem;