/*
 * StorePointListTab组件：用于充值/积分明细列表tab下的数据展示
 *
 * 1. dataItems：全部的数据
 * 2. dataItemsIncrease：增加的数据
 * 3. dataItemsDecrease：减少的数据
 * 4. itemHandleClick：点击item进行的回调函数
 * 5. onTabClick：点击tab进行的回调函数
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Tabs, List } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import QueueAnim from 'rc-queue-anim';

import StorePointListItem from '@/common/components/store_point_list_item/StorePointListItem';

import no_data from '@/base/assets/images/no_data.png';

class StorePointListTab extends Component {
    static propTypes = {
        dataItems: PropTypes.array.isRequired,
        dataItemsIncrease: PropTypes.array.isRequired,
        dataItemsDecrease: PropTypes.array.isRequired,
        itemHandleClick: PropTypes.func.isRequired,
        onTabClick: PropTypes.func.isRequired
    };

    state = {
        tabs: [
            { title: '全部' },
            { title: '增加' },
            { title: '减少' }
        ]
    };

    // tab栏固定
    renderTabBar = (props) => {
        return (<Sticky>
            {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
        </Sticky>);
    };

    render() {
        const {
            tabs
        } = this.state;

        const {
            dataItems,
            dataItemsIncrease,
            dataItemsDecrease,
            itemHandleClick,
            onTabClick
        } = this.props;
        return (
            <div className="store-point-list-tab-container">
                <StickyContainer>
                    <Tabs tabs={tabs} initialPage={0} swipeable={false}
                          renderTabBar={this.renderTabBar}
                          onTabClick={(tab, index) => {onTabClick(tab,index)}}
                    >
                        {
                            dataItems == '' ? (
                                <div className="no-data">
                                    <img src={no_data} alt="" />
                                    <div>暂无数据</div>
                                </div>
                            ) : (
                                <div className="list-item-wrap">
                                    <List>
                                        <QueueAnim type='top'>
                                            {
                                                dataItems.map((item, index) => {
                                                    return (
                                                        <StorePointListItem item={item}
                                                                            key={index}
                                                                            handleClick={itemHandleClick(item.id)}
                                                        />
                                                    )
                                                })
                                            }
                                        </QueueAnim>
                                    </List>
                                    <div className="no-more">没有更多了...</div>
                                </div>
                            )
                        }
                        {
                            dataItemsIncrease == '' ? (
                                <div className="no-data">
                                    <img src={no_data} alt="" />
                                    <div>暂无数据</div>
                                </div>
                            ) : (
                                <div className="list-item-wrap">
                                    <List>
                                        <QueueAnim type='top'>
                                            {
                                                dataItemsIncrease.map((item, index) => {
                                                    return (
                                                        <StorePointListItem item={item}
                                                                            key={index}
                                                                            handleClick={itemHandleClick(item.id)}
                                                        />
                                                    )
                                                })
                                            }
                                        </QueueAnim>
                                    </List>
                                    <div className="no-more">没有更多了...</div>
                                </div>
                            )
                        }
                        {
                            dataItemsDecrease == '' ? (
                                <div className="no-data">
                                    <img src={no_data} alt="" />
                                    <div>暂无数据</div>
                                </div>
                            ) : (
                                <div className="list-item-wrap">
                                    <List>
                                        <QueueAnim type='top'>
                                            {
                                                dataItemsDecrease.map((item, index) => {
                                                    return (
                                                        <StorePointListItem item={item}
                                                                            key={index}
                                                                            handleClick={itemHandleClick(item.id)}
                                                        />
                                                    )
                                                })
                                            }
                                        </QueueAnim>
                                    </List>
                                    <div className="no-more">没有更多了...</div>
                                </div>
                            )
                        }
                    </Tabs>
                </StickyContainer>
            </div>
        );
    }
}

export default StorePointListTab;