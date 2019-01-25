import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import Tloader from 'react-touch-loader';
import { StickyContainer, Sticky} from 'react-sticky';
import QueueAnim from 'rc-queue-anim';
import {Tabs, List} from 'antd-mobile';

import StorePointListHeader from '@/common/components/store_point_list_header/StorePointListHeader';
import StorePointListItem from '@/common/components/store_point_list_item/StorePointListItem';
import store_value_list_icon from '@/stored_value/assets/images/store_value_list_icon.png';
import RechargeService from '@/stored_value/services/recharge.service';
import no_data from '@/base/assets/images/no_data.png';
import {getRechargeType} from './js/recharge_utile';

class StoredValueList extends Component {
    state = {
        account: 0, // 卡种账户余额
        data: [],
        tabs: [
            { title: '全部' },
            { title: '增加' },
            { title: '减少' }
        ],
        currentflag: 0, // 当前状态
        hasMore: false,
        initializing: 0,
        autoLoadMore: false,
        pageindex: 1,
        pagesize: 10,
        totalpage: 0
    };

    componentDidMount() {
        // 修改页面Title
        this.GetPageTitle();
        // 获取余额
        this.GetMemberAccount();
        // 获取充值明细列表
        this.GetRechargeDetailList();
    }

    /**
     * 修改页面Title
     */
    GetPageTitle = () => {
        // 接收从首页跳转过来的cardSpecId 1-汽油卡 2-柴油卡
        const cardSpecId = this.props.query.cardSpecId;
        if(cardSpecId) {
            if(cardSpecId == 1) {
                document.title = '汽油卡明细';
            } else if(cardSpecId == 2) {
                document.title = '柴油卡明细';
            }
        }
    }

    // tab栏固定
    renderTabBar = (props) => {
        return (<Sticky>
            {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
        </Sticky>);
    };

    /**
     * 获取充值明细列表
     */
    GetRechargeDetailList = (callback) => {
        const cardSpecId = this.props.query.cardSpecId;
        const {pageindex, pagesize, currentflag, data} = this.state;
        RechargeService.GetRechargeDetailList({
            pageNO: pageindex,
            pageSize: pagesize,
            cardSpecId,
            type: this.getRechargeType(currentflag)
        }).then(res => {
            if (res != null) {
                // 判断分页
                this.judgePage(res.total);
                if (pageindex == 1) {
                    this.setState({data: this.bindData(res.items)});
                } else {
                    data = data.concat(this.bindData(res.items));
                    this.setState({data});
                }
            }
            this.setState({initializing: 2}); // 结束进度条
            if (callback) {
                callback();
            }
        })
    }

    /**
     * 绑定数据源
     */
    bindData = (res) => {
        let data = [];
        res.map(item => {
            let dataitem = {
                id: item.storedId,
                title: getRechargeType(item.tradeType),
                time: moment(item.tradeTime).format('YYYY.MM.DD HH:mm:ss'),
                data: this.getTypeInfo(item.tradeType, item.amount)
            }
            data.push(dataitem);
        })
        return data;
    }

    /**
     * 获取内容
     */
    getTypeInfo = (type, data) => {
        switch (type) {
            case 1:
            case 3:
            case 4:
                return `+￥${Number(data).toFixed(2)}`;
            case 2:
                return `-￥${Number(data).toFixed(2)}`;
            default:
                return '-';
        }
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
            this.GetRechargeDetailList(resolve);
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
                this.GetRechargeDetailList(resolve)
            })
        }
    }

    // 点击item跳转明细详情
    handleClick = id => {
        this.props.history.push(`/app/stored-value/detail/${id}`)
    };

    // 点击tab进行的回调函数
    onTabClick = (tab, index) => {
        this.setState({data: [], currentflag: index}, () => {
            this.GetRechargeDetailList(index)
        })
    };

    // 前往充值
    goRecharge = () => {
        this.props.history.push('/app/recharge');
    };

    /**
     * 获取会员卡种账户余额
     */
    GetMemberAccount = () => {
        const {MemberInfo} = this.props;
        if (MemberInfo) {
            let card = MemberInfo.cards.find(c=>c.cardSpecId == this.props.query.cardSpecId);
            if (card) {
                this.setState({
                    account: card.availableAmount || 0
                })
            }
        }
    }

    /**
     * 获取充值类型
     * 1-充值 2-充值卡消费 3-退款退回 4-充值赠送; 1/3/4:增加、2减少
     */
    getRechargeType = (type) => {
        switch (type) {
            case 0:
                return '';
            case 1:
                return [1, 3, 4].toString();
            case 2:
                return [2].toString();
            default:
                return null;
        }
    }

    render() {
        const {
            data,
            account, 
            hasMore, initializing, autoLoadMore, tabs,
            totalpage, pageindex
        } = this.state;
        return (
            <div className="store-list-container">
                <StorePointListHeader fieldImg={store_value_list_icon}
                    fieldText={account.toFixed(2).toString()}
                    fieldSubtext="元"
                    buttonText="前往充值"
                    buttonClick={this.goRecharge}
                />
                <div className="store-list-tab-container">
                    <StickyContainer>
                        <Tabs tabs={tabs} initialPage={0} swipeable={false}
                            renderTabBar={this.renderTabBar}
                            onTabClick={(tab, index) => {this.onTabClick(tab,index)}}>
                            <Tloader
                                onRefresh={this.refresh}
                                onLoadMore={this.loadMore}
                                hasMore={hasMore}
                                autoLoadMore={autoLoadMore}
                                initializing={initializing}>
                                {
                                    data.length <= 0 ? (
                                        <div className="no-data">
                                            <img src={no_data} alt="" />
                                            <div>暂无数据</div>
                                        </div>
                                    ) : (
                                        <div className="list-item-wrap">
                                            <List>
                                                <QueueAnim type='top'>
                                                    {
                                                        data.map((item, index) => {
                                                            return (
                                                                <StorePointListItem item={item}
                                                                    key={index}
                                                                    handleClick={this.handleClick}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </QueueAnim>
                                            </List>
                                            {totalpage == pageindex ? <div className="no-more">没有更多了...</div> : null}
                                        </div>
                                    )
                                }
                            </Tloader>
                        </Tabs>
                    </StickyContainer>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        MemberInfo: state.MemberInfo
    }), {}
)(StoredValueList);