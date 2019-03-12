import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import QueueAnim from 'rc-queue-anim';

import StorePointDetail from "@/common/components/store_point_detail/StorePointDetail";
import PointDetailService from '@/point_mall/services/point_detail/point_detail.service';
import {getPointType} from './js/point_utile';

class PointDetailContent extends Component {
    state = {
        // 模拟后端传回来的数据源
        listItems: {},
        // 包装过的数据源
        itemsMap: new Map()
    };

    componentWillMount() {
        const merchantId = this.props.query.merchantId;
        if (merchantId) {
            // 微信公众号跳转过来保存商户ID
            sessionStorage.setItem('wxmerchantId', merchantId);
        }
        PointDetailService.GetPointDetailInfo(this.props.params.id).then(res => {            
            this.bindData(res);
        })
    }

    /**
     * 绑定数据源
     */
    bindData = (result) => {
        if (result != null) {
            let listItems = {
                id: result.id,
                mobile: result && result.mobile ? result.mobile : '-',
                reason: result.remark || '-',
                type: getPointType(result.type),
                flag: result.type,
                score: result.score || 0,
                time: moment(result.createTime).format('YYYY.MM.DD HH:mm:ss') || '-',
                afterTradeScore: result.postTradeBalance || '-'
            }
            // 对数据源进行key的转换，英文转文字
            let _itemsMap = new Map();
            Object.keys(listItems).map(key => {
                switch (key) {
                    case 'mobile':
                        _itemsMap.set(1, ['手机号', listItems[key]]);
                        break;
                    case 'reason':
                        // _itemsMap.set(2, ['变动原因', listItems[key]]);
                        break;
                    case 'type':
                        _itemsMap.set(3, ['交易类型', listItems[key]]);
                        break;
                    case 'afterTradeScore':
                        _itemsMap.set(4, ['交易后积分', `${listItems[key]}积分`]);
                        break;
                    case 'time':
                        _itemsMap.set(5, ['交易时间', listItems[key]]);
                        break;
                    default:
                        break;
                }
                return _itemsMap;
            });
            // 对转换过的数据源进行排序
            const _keys = _itemsMap.keys();
            let sortKeys = [..._keys].sort((x, y) => x - y);
            let itemsMap = new Map();
            sortKeys.map((_item) => {
                return itemsMap.set(_item, _itemsMap.get(_item))
            });
            this.setState({
                listItems,
                itemsMap
            });
        }
    }

    getNumber = (listItems) => {
        switch (listItems.flag) {
            case 0:
            case 2:
            case 4:
                return listItems.score;
            case 1:
            case 3:
                return (0 - listItems.score);
            case 5: // 手动修改 增加
                return listItems.score;
            case 6: // 手动修改 减少
                return (0 - listItems.score);
            case 7: // 会员导入
                return listItems.score;
            default:
                return 0;
        }
    }

    render() {
        const {
            itemsMap,
            listItems
        } = this.state;

        const {
            history
        } = this.props;

        return (
            <QueueAnim style={{height:'100%'}} type={['right', 'left']} delay={200} duration={1500} leaveReverse={true} forcedReplay={true}>
                <div className="grey-back point-detail-container" key="point-detail">
                    <StorePointDetail type="point" itemsMap={itemsMap} history={history} number={this.getNumber(listItems)}/>
                </div>
            </QueueAnim>
        );
    }
}

export default connect(state => ({
    MemberInfo: state.MemberInfo
}), {})(PointDetailContent);