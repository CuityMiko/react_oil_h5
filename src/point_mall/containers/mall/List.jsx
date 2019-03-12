import React, {Component} from 'react';
import { WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import {connect} from 'react-redux';
import Tloader from 'react-touch-loader';

import Field from '@/common/components/field/Field';
import GoodsItem from '@/point_mall/components/goods_item/GoodsItem';
import {GetMemberInfoAction} from '@/base/redux/actions';
import point_diamond from '@/point_mall/assets/images/point_diamond.png';
import default_head_img from '@/base/assets/images/default_head_img.png';
import no_data from '@/base/assets/images/no_data.png';
import MallService from '@/point_mall/services/mall/mall.service';

class MallList extends Component {
    state = {
        goodsItems: [],
        hasMore: false,
        initializing: 0,
        autoLoadMore: false,
        pageindex: 1,
        pagesize: 6,
        totalpage: 0
    };

    componentWillMount() {
        // 获取商品列表
        this.GetMallList();
    }

    /**
     * 获取商品列表
     */
    GetMallList = (callback) => {
        let {pageindex, pagesize, goodsItems} = this.state;
        this.setState({initializing: 1}); // 加载进度条
        MallService.GetMallList(pageindex, pagesize).then(res => {
            if (res != null) {
                // 判断分页
                this.judgePage(res.total);
                if (pageindex == 1) {
                    this.setState({goodsItems: res.items});
                } else {
                    goodsItems = goodsItems.concat(res.items);
                    this.setState({goodsItems});
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
     * 跳转详情页
     */
    goToDetail = (id) => {
        this.props.history.push(`/app/mall/detail/${id}`);
    };

    /**
     * 立即兑换
     */
    redeemClick = (id) => {
        const _self = this;
        const {GetMemberInfoAction} = _self.props;
        MallService.RedeemGoods(id).then(res => {
            Toast.info('兑换成功', 1, () => {
                // 更新会员信息状态
                GetMemberInfoAction();
                _self.props.history.push(`/app/mall/redeemdetail/${res.recordId}`);
            });
        })
    }

    /**
     * 下拉刷新
     */
    refresh = (resolve, reject) => {
        this.setState({pageindex: 1}, () => {
            this.GetMallList(resolve);
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
                this.GetMallList(resolve)
            })
        }
    }
    
    render() {
        const { goodsItems, hasMore, initializing, autoLoadMore } = this.state;
        const {MemberInfo, rootinfo} = this.props;
        return (
            <div className="grey-back mall-list-container">
                <Field text={MemberInfo && MemberInfo.name ? MemberInfo.name : '-'} customClass="define-field-class" imgSrc={MemberInfo && MemberInfo.headimgUrl ? MemberInfo.headimgUrl : default_head_img}>
                    <div className="field-right-content">
                        <img src={point_diamond} alt="" />
                        <div className="text"><span className="bigger">{MemberInfo && MemberInfo.availableScore ? MemberInfo.availableScore : '0'}</span>积分</div>
                    </div>
                </Field>
                <Tloader
                    // onRefresh={this.refresh}
                    onLoadMore={this.loadMore}
                    hasMore={hasMore}
                    autoLoadMore={autoLoadMore}
                    initializing={initializing}>
                {
                    goodsItems == null || goodsItems.length <= 0 ? (
                        <div className="no-data">
                            <img src={no_data} alt="" />
                            <div>暂无数据</div>
                        </div>
                    ) : (
                        <div className="content">
                            <WhiteSpace size="xs" />
                            <WingBlank size="sm">
                                <div className="goods-item-wrap">
                                    {
                                        goodsItems.map((goodsItem, index) => {
                                            return (
                                                <GoodsItem goodsItem={goodsItem} useScene="mallList" key={index} handleClick={(e) => {this.goToDetail(goodsItem.id)}} redeemClick={(id) => {this.redeemClick(id)}} />
                                            )
                                        })
                                    }
                                    {rootinfo.isIOS?(<WhiteSpace size="xl" />):('')}
                                </div>
                            </WingBlank>
                        </div>
                    )
                }
                </Tloader>
            </div>
        );
    }
}

export default connect(state => {
    const MemberInfo = state.MemberInfo;
    const rootinfo = state.AppData.rootinfo;
    return {
        MemberInfo,
        rootinfo
    }
}, {GetMemberInfoAction})(MallList);