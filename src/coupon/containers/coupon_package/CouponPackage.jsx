import React, { Component } from 'react';
import { Tabs, WingBlank, WhiteSpace } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import QueueAnim from 'rc-queue-anim';
import Tloader from 'react-touch-loader';
import {connect} from "react-redux";

import CouponComponent from "@/common/components/coupon_component/CouponComponent";
import MobileButton from '@/common/components/mobile_button/MobileButton';
import has_used_icon_sm from '@/coupon/assets/images/has_used_icon_sm.png';
import invalid_icon_sm from '@/coupon/assets/images/invalid_icon_sm.png';
import no_coupon from '@/coupon/assets/images/no_coupon.png';
import CouponService from '@/coupon/services/coupon.service';

class CouponPackage extends Component {
    state = {
        number: 0,
        tabs: [],
        couponItems: [],
        pageindex: 1,
        pagesize: 10,
        totalpage: 0,
        status: 0,
        hasMore: false,
        initializing: 0,
        autoLoadMore: false
    };

    componentDidMount() {
        // 获取卡券列表
        this.GetMemberCoupons();
    }

    /**
     * 绑定Tab
     */
    bindTabs = () => {
        const { number } = this.state;
        this.setState({
            tabs: [
                { title: `未使用(${number})`, status: 0},
                { title: '已使用', status: 1 },
                { title: '已作废', status: 2 }
            ]
        })
    }

    /**
     * Tab切换
     */
    tabChange = (tab) => {
        this.setState({
            pageindex: 1,
            pagesize: 6,
            status: tab.status,
            couponItems: []
        }, () => {
            this.GetMemberCoupons();
        })
    }

    /**
     * 获取卡券列表
     */
    GetMemberCoupons = (callback) => {
        let {pageindex, pagesize, status, couponItems} = this.state;
        this.setState({initializing: 1}); // 加载进度条
        CouponService.GetMemberCoupons({
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
                    this.setState({couponItems: res.items});
                } else {
                    couponItems = couponItems.concat(res.items);
                    this.setState({couponItems});
                }
            } else {
                this.bindTabs();
                this.setState({couponItems: []});
            }
            this.setState({initializing: 2}); // 结束进度条
            if (callback) {
                callback();
            }
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
            this.GetMemberCoupons(resolve);
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
                this.GetMemberCoupons(resolve)
            })
        }
    }

    // 跳转卡券详情页面
    goDetail = (id) => {
        this.props.history.push(`/app/coupon/detail/${id}?flag=package`)
    };

    /**
     * 获取卡券右侧内容部分
     */
    getRightContent = (couponItem, index, status) => {
        if (status == 0) { // 未使用
            return (
                <CouponComponent couponItem={couponItem}
                    key={index}
                    handleClick={(e)=>{this.goDetail(couponItem.couponNumber)}}>
                    <MobileButton text="去使用" buttonClass="shortButton" handleClick={(e)=>{this.goToUse(couponItem.couponNumber)}} />
                </CouponComponent>
            )
        }
        if (status == 1) { // 已使用
            return (
                <CouponComponent couponItem={couponItem}
                    key={index}
                    customClass="coupon-icon"
                    handleClick={(e)=>{this.goDetail(couponItem.couponNumber)}}>
                    <img src={has_used_icon_sm} alt="" />
                </CouponComponent>
            );
        }
        if (status == 2) { // 已作废
            return (
                <CouponComponent couponItem={couponItem}
                    useScene="invalid-coupon"
                    key={index}
                    customClass="coupon-icon"
                    handleClick={(e)=>{this.goDetail(couponItem.couponNumber)}}>
                    <img src={invalid_icon_sm} alt="" />
                </CouponComponent>
            );
        }
    }

    /**
     * 去使用
     */
    goToUse = (couponNumber) => {
        this.props.history.push('/app/payment?couponnum=' + couponNumber);
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
            couponItems,
            hasMore, initializing, autoLoadMore, status
        } = this.state;

        const { rootinfo } = this.props;

        return (
            <div className="grey-back coupon-package-container">
                <StickyContainer>
                    <Tabs tabs={tabs} initialPage={0} renderTabBar={this.renderTabBar} usePaged={true} swipeable={false} animated={true} onChange={this.tabChange}>
                        {
                            couponItems == '' ? (
                                <div className="no-data">
                                    <img src={no_coupon} alt="" />
                                    <div>暂无卡券</div>
                                </div>
                            ) : (
                                <Tloader
                                    onRefresh={this.refresh}
                                    onLoadMore={this.loadMore}
                                    hasMore={hasMore}
                                    autoLoadMore={autoLoadMore}
                                    initializing={initializing}>
                                    <div>
                                        <WingBlank size="sm">
                                            <QueueAnim type="top">
                                                {
                                                    couponItems.map((couponItem, index) => {
                                                        return this.getRightContent(couponItem, index, status)
                                                    })
                                                }
                                            </QueueAnim>
                                            <WhiteSpace size="xs" />
                                            {rootinfo.isIOS?(<WhiteSpace size="xl" />):('')}
                                        </WingBlank>
                                    </div>
                                </Tloader>
                            )
                        }
                    </Tabs>
                </StickyContainer>
            </div>
        )
    }
}

export default connect(state => {
    const rootinfo = state.AppData.rootinfo;
    return {
        rootinfo
    }
}, {})(CouponPackage);