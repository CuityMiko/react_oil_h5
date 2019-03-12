import React, {Component} from 'react';
import { WhiteSpace, Tabs, WingBlank } from 'antd-mobile';
import Tloader from 'react-touch-loader';
import { StickyContainer, Sticky } from 'react-sticky';
import {connect} from "react-redux";

import GoodsItem from '@/point_mall/components/goods_item/GoodsItem';
import no_data from '@/base/assets/images/no_data.png';
import DeliveryCodeService from '@/point_mall/services/delivery_code/delivery_code.service';

class DeliveryCode extends Component {
    state = {
        number: 0,
        tabs: [],
        goodsItems: [],
        pageindex: 1,
        pagesize: 6,
        totalpage: 0,
        status: 0,
        hasMore: false,
        initializing: 0,
        autoLoadMore: false,
    };

    componentDidMount() {
        // 获取提货码列表
        this.GetDeliveryCodeList();
    }

    /**
     * 绑定Tab
     */
    bindTabs = () => {
        const { number } = this.state;
        this.setState({
            tabs: [
                { title: `未使用(${number})`, status: 0},
                { title: '已使用', status: 1}
            ]
        })
    }

    /**
     * 获取提货码列表
     */
    GetDeliveryCodeList = (callback) => {
        let {pageindex, pagesize, status, goodsItems} = this.state;
        this.setState({initializing: 1}); // 加载进度条
        DeliveryCodeService.GetDeliveryCodeList({
            pageNO: pageindex, 
            pageSize: pagesize, 
            status
        }).then(res => {
            if (res != null) {
                // 判断分页
                this.judgePage(res.total);
                if(status === 0) {
                    this.setState({
                        number: res.total
                    }, () => {
                        this.bindTabs();
                    })
                }
                if (pageindex == 1) {
                    this.setState({goodsItems: res.items});
                } else {
                    goodsItems = goodsItems.concat(res.items);
                    this.setState({goodsItems});
                }
            } else {
                this.bindTabs();
                this.setState({goodsItems: []});
            }
            this.setState({initializing: 2}); // 结束进度条
            if (callback) {
                callback();
            }
        })
    }

    /**
     * 点击GoodsItem跳转提货码详情
     */
    handleClick = (id) => {
        this.props.history.push(`/app/mall/redeemdetail/${id}`)
    };

    /**
     * 去使用
     */
    redeemClick = (id) => {
        this.props.history.push(`/app/mall/redeemdetail/${id}`);
    }

    /**
     * Tab切换
     */
    tabChange = (tab) => {
        this.setState({
            pageindex: 1,
            pagesize: 6,
            status: tab.status,
            goodsItems: []
        }, () => {
            this.GetDeliveryCodeList();
        })
    }

    /**
     * 判断分页
     */
    judgePage = (total) => {
        let {pageindex, pagesize, totalpage} = this.state;
        if (total % pagesize == 0) {
            totalpage = total / pagesize;
        } else {
            totalpage = parseInt(total / pagesize) + 1;
        }
        if (pageindex >= totalpage) {
            this.setState({
                hasMore: false,
                autoLoadMore: false
            })
        } else {
            this.setState({
                hasMore: true,
                autoLoadMore: true
            })
        }
        this.setState({totalpage});
    }

    /**
     * 下拉刷新
     */
    refresh = (resolve, reject) => {
        this.setState({pageindex: 1}, () => {
            this.GetDeliveryCodeList(resolve);
        })
    }

    /**
     * 加载更多
     */
    loadMore = (resolve) => {
        let {pageindex, pagesize, totalpage} = this.state;
        if (pageindex >= totalpage) {
            this.setState({
                hasMore: false,
                autoLoadMore: false
            })
        } else {
            pageindex = pageindex + 1;
            this.setState({pageindex}, () => {
                this.GetDeliveryCodeList(resolve)
            })
        }
    }

    // tab栏固定
    renderTabBar = (props) => {
        return (<Sticky>
            {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
        </Sticky>);
    };
    
    render() {
        const {
            tabs,
            goodsItems,
            hasMore, initializing, autoLoadMore, status
        } = this.state;
        const { rootinfo } = this.props;
        return (
            <div className="grey-back delivery-code-container">
                <StickyContainer>
                    <Tabs tabs={tabs} initialPage={0} renderTabBar={this.renderTabBar} usePaged={true} animated={true} swipeable={false} onChange={this.tabChange}>
                        <Tloader
                                // onRefresh={this.refresh}
                                onLoadMore={this.loadMore}
                                hasMore={hasMore}
                                autoLoadMore={autoLoadMore}
                                initializing={initializing}>
                            {
                                goodsItems == '' ? (
                                    <div className="no-data">
                                        <img src={no_data} alt="" />
                                        <div>暂无数据</div>
                                    </div>
                                ) : (
                                    <div>
                                        <WhiteSpace size="xs" />
                                        <WingBlank size="sm">
                                            <div className="goods-item-wrap">
                                                {
                                                    goodsItems.map((goodsItem, index) => {
                                                        return (
                                                            <GoodsItem useScene={status == 0 ? 'myDeliveryCodeNotUse' : 'myDeliveryCodeHasUsed'} goodsItem={goodsItem} key={index} handleClick={() => {this.handleClick(goodsItem.id)}} redeemClick={() => {this.redeemClick(goodsItem.id)}}/>
                                                        )
                                                    })
                                                }
                                            </div>
                                            {rootinfo.isIOS?(<WhiteSpace size="xl" />):('')}
                                        </WingBlank>
                                    </div>
                                )
                            }
                        </Tloader>
                    </Tabs>
                </StickyContainer>
            </div>
        );
    }
}

export default connect(state => {
    const rootinfo = state.AppData.rootinfo;
    return {
        rootinfo
    }
}, {})(DeliveryCode);