import React, { Component } from 'react';
import { WingBlank, Toast, WhiteSpace } from 'antd-mobile';
import moment from 'moment';
import QueueAnim from 'rc-queue-anim';
import Tloader from 'react-touch-loader';
import {connect} from 'react-redux';

import CouponComponent from "@/common/components/coupon_component/CouponComponent";
import MobileButton from '@/common/components/mobile_button/MobileButton';
import CountDown from '@/coupon/components/count_down/CountDown';
import coupon_list_title from '@/coupon/assets/images/coupon_list_title.png';
import coupon_out_icon from '@/coupon/assets/images/coupon_out_icon.png';
import no_coupon from '@/coupon/assets/images/no_coupon.png';
import CouponService from '@/coupon/services/coupon.service';
import {GetMemberInfoAction} from '@/base/redux/actions';

class CouponList extends Component {
    state = {
        couponItems: [],
        pageindex: 1,
        pagesize: 10,
        hasMore: false,
        initializing: 0,
        autoLoadMore: false,
        totalpage: 0
    };

    componentWillMount() {
        this.GetCouponSquareList();
    }
    
    /**
     * 获取卡券广场列表
     */
    GetCouponSquareList = (callback) => {
        let {pageindex, pagesize, couponItems} = this.state;
        this.setState({initializing: 1}); // 加载进度条
        CouponService.GetCouponSquareList(pageindex, pagesize).then(res => {
            this.setState({couponItems: res.items})
            if (res != null) {
                // 判断分页
                this.judgePage(res.total);
                if (pageindex == 1) {
                    this.setState({couponItems: res.items});
                } else {
                    couponItems = couponItems.concat(res.items);
                    this.setState({couponItems});
                }
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
            this.GetCouponSquareList(resolve);
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
                this.GetCouponSquareList(resolve)
            })
        }
    }

    // 跳转卡券详情页面
    goDetail = (id) => {
        this.props.history.push(`/app/coupon/detail/${id}`)
    };

    // 立即抢
    goRob = (e, id) => {
        const {GetMemberInfoAction} = this.props;
        let {couponItems} = this.state;
        CouponService.TakeCoupon(id).then(res => {
            Toast.success('领取成功', 1, () => {
                // 更新用户状态
                GetMemberInfoAction();
                let currcouponItems = [];
                couponItems.map(c => {
                    let availInventory = c.availInventory - 1;
                    availInventory = availInventory > 0 ? availInventory : 0;
                    if (c.id == id) {
                        let citem = {...c, isuse: true, availInventory}
                        currcouponItems.push(citem);
                    } else {
                        currcouponItems.push(c);
                    }
                })
                this.setState({
                    couponItems: currcouponItems
                })
            })
        }).catch(err => {
            Toast.fail(err);
        })
    };

    /**
     * 去使用
     */
    goToUse = (e, couponNumber) => {
        this.props.history.push('/app/payment?couponnum=' + couponNumber);
    }

    // 判断显示卡券的右边显示什么元素
    judge = (item) => {
        let nowTime = moment().format('X');
        let startTime = moment(item.actTimeStart).format('X');
        let endTime = moment(item.actTimeEnd).format('X');
        if (item.availInventory > 0) {
            if (startTime <= nowTime && nowTime <= endTime) {
                // 进行中，立即抢
                return (
                    <div className="rob">
                        {
                            parseInt(item.availInventory) > 50 ? null : <div className="text">剩余<span>{item.availInventory}</span>张</div>
                        }
                        {
                            item.isuse != undefined && item.isuse == true ? (
                                <MobileButton text="去使用" buttonClass="shortButton" handleClick={(e) => {this.goToUse(e, item.couponNumber)}} />
                            ) : (
                                <MobileButton text="立即抢" buttonClass="shortButton" handleClick={(e) => {this.goRob(e, item.id)}} />
                            )
                        }
                    </div>
                )
            } else if (startTime > nowTime) {
                // 未开始
                let _diff = moment.duration(startTime - nowTime, 'seconds');
                let days = Math.floor(_diff.asDays());
                if(days >= 1) {
                    // 剩余x天开抢
                    // 如果倒计时天数大于99天，则显示99天
                    if(days > 99) {
                        days = 99;
                    }
                    return (
                        <div className="day">
                            <MobileButton text="未开始" disabled buttonClass="shortButton" customClass="not-start" handleClick={() => {}} />
                            <div className="text">剩余<span>{days}</span>天开抢</div>
                        </div>
                    )
                } else if (days < 1 ) {
                    // 剩余x时x分x秒开抢
                    return (
                        <div className="hour">
                            <MobileButton text="未开始" disabled buttonClass="shortButton" customClass="not-start" handleClick={() => {}} />
                            <CountDown startTime={startTime} handleChange={this.handleChange} />
                        </div>
                    )
                }
            }
        } else if(item.availInventory <= 0) {
            // 库存为0时显示已被抢完
            return (
                <div className="coupon-out">
                    <img src={coupon_out_icon} alt="" />
                    <div className="text">已被抢完</div>
                </div>
            )
        }
    };

    // 倒计时结束之后再次请求卡券广场列表接口render
    handleChange = () => {
        this.setState({
            couponItems: [],
            pageindex: 1,
            pagesize: 10
        }, () => {
            this.GetCouponSquareList();
        })
    };

    render() {
        const { couponItems, hasMore, initializing, autoLoadMore } = this.state;
        const { rootinfo } = this.props;
        return (
            <div className="grey-back coupon-list-container">
                <div className="title">
                    <img src={coupon_list_title} alt="" />
                </div>
                <Tloader
                    // onRefresh={this.refresh}
                    onLoadMore={this.loadMore}
                    hasMore={hasMore}
                    autoLoadMore={autoLoadMore}
                    initializing={initializing}>
                    {
                        couponItems == '' ? (
                            <div className="no-data">
                                <img src={no_coupon} alt="" />
                                <div>暂无卡券</div>
                            </div>
                        ) : (
                            <div className="content">
                                <WingBlank size="sm">
                                    <QueueAnim type={['right', 'left']}>
                                        {
                                            couponItems.map((couponItem, index) => {
                                                return (
                                                    <CouponComponent couponItem={couponItem} key={index} handleClick={(e)=>{this.goDetail(couponItem.couponNumber)}}>
                                                        {this.judge(couponItem)}
                                                    </CouponComponent>
                                                )
                                            })
                                        }
                                    </QueueAnim>
                                    <WhiteSpace size="xs" />
                                    {rootinfo.isIOS?(<WhiteSpace size="xl" />):('')}
                                </WingBlank>
                            </div>
                        )
                    }
                </Tloader>
            </div>
        )
    }
}

export default connect(state => {
    const rootinfo = state.AppData.rootinfo;
    return {
        rootinfo
    }
}, {GetMemberInfoAction})(CouponList);