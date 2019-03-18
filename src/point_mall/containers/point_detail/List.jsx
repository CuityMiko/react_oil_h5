import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import QueueAnim from 'rc-queue-anim';

import StorePointListHeader from '@/common/components/store_point_list_header/StorePointListHeader';
import PopupComponent from '@/common/components/popup_component/PopupComponent';
import PointIntro from '@/point_mall/containers/point_detail/components/point_intro/PointIntro';
import StorePointListTab from '@/common/components/store_point_list_tab/StorePointListTab';
import point_diamond from '@/point_mall/assets/images/point_diamond.png';
import PointDetailService from '@/point_mall/services/point_detail/point_detail.service';
import {getPointType} from './js/point_utile';

class PointDetail extends Component {
    state = {
        dataSource: [],
        modal: false,
        currentflag: 0 // 当前状态
    };

    componentWillMount() {
        const {currentflag} = this.state;
        this.GetPointDetailList(currentflag)

    }

    /**
     * 获取积分明细列表
     */
    GetPointDetailList = (currentflag) => {
        const _self = this;
        PointDetailService.GetPointDetailList(currentflag).then(res => {   
            _self.bindDataSource(res);
        })
    }

    /**
     * 绑定数据源
     */
    bindDataSource = (data) => {
        let dataSource = [];
        if (data != null && data.length > 0) {
            data.map(item => {
                if (item != null) {
                    const pointdetail = {
                        id: item.id,
                        title: getPointType(item.type),
                        time: moment(item.createTime).format('YYYY.MM.DD HH:mm:ss'),
                        data: this.getScore(item.score, item.type),
                        timer: item.createTime,
                        createTime: item.createTime
                    }
                    dataSource.push(pointdetail);
                }
            })
            dataSource = dataSource.sort((x, y) => y.createTime - x.createTime);
            this.setState({dataSource})
        } else {
            this.setState({dataSource})
        }
    }

    /**
     * 获取积分
     */
    getScore = (score, type) => {
        switch (type) {
            case 0:
            case 2:
            case 4:
            case 5:
            case 7:
                return `+${score} 积分`;
            case 1:
            case 3:
            case 6:
                return `-${score} 积分`;
            default:
                return '-';
        }
    }

    // 跳转明细详情
    handleClick = id => () => {
        this.props.history.push(`/app/mall/point_detail/${id}`)
    };

    // 点击tab后的回调函数
    onTabClick = (tab, index) => {
        this.setState({dataSource: [], currentflag: index}, () => {
            this.GetPointDetailList(index)
        })
    };

    // 显示积分须知弹窗
    showModal = key => (e) => {
        this.setState({
            [key]: true
        })
    };

    // 关闭积分须知弹窗
    onClose = key => (e) => {
        this.setState({
            [key]: false
        })
    };
    
    render() {
        const {dataSource, currentflag, modal} = this.state;
        const {MemberInfo} = this.props;

        return (
            <div className="point-list-container" style={modal ? {overflow: 'hidden'}: {overflow: 'auto'}} key="point-list-detail">
                <StorePointListHeader
                    fieldImg={point_diamond}
                    fieldText={MemberInfo && MemberInfo.availableScore.toString() ? MemberInfo.availableScore.toString() : '0'}
                    fieldSubtext="积分"
                    buttonText="积分须知"
                    buttonClick={this.showModal('modal')}
                />
                <PopupComponent visible={modal} onClose={this.onClose('modal')} direction="center" >
                    <PointIntro />
                </PopupComponent>
                <StorePointListTab dataItems={currentflag == 0 ? dataSource : []}
                    dataItemsIncrease={currentflag == 1 ? dataSource : []}
                    dataItemsDecrease={currentflag == 2 ? dataSource : []}
                    itemHandleClick={this.handleClick}
                    onTabClick={this.onTabClick}
                />
            </div>
        );
    }
}

export default connect(state => ({
    MemberInfo: state.MemberInfo
}), {})(PointDetail);