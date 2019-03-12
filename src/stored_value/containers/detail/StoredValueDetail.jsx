import React, { Component } from "react";
import { connect } from "react-redux";
import QueueAnim from 'rc-queue-anim';

import StorePointDetail from "@/common/components/store_point_detail/StorePointDetail";
import RechargeService from "@/stored_value/services/recharge.service";
import { getRechargeType } from "./js/recharge_utile";
import moment from "moment";

class StoredValueDetail extends Component {
  state = {
    // 模拟后端传回来的数据源
    listItems: {},
    // 包装过的数据源
    itemsMap: new Map()
  };

  componentWillMount() {
    // 获取充值明细
    this.GetRechargeDetailInfo();
  }

  /**
   * 修改页面Title
   */
  GetPageTitle = type => {
    // 将页面title设置为交易类型
    if (type) {
      document.title = type;
    }
  };

  /**
   * 绑定Map格式
   */
  bindMap = () => {
    const { listItems } = this.state;
    // 对数据源进行key的转换，英文转文字
    let _itemsMap = new Map();
    Object.keys(listItems).map(key => {
      switch (key) {
        // case 'orderNumber':
        //     _itemsMap.set(1, ['订单编号', listItems[key]]);
        //     break;
        // case 'chargeNumber':
        //     _itemsMap.set(2, ['充值单号', listItems[key]]);
        //     break;
        // case 'refundNumber':
        //     _itemsMap.set(3, ['退款订单号', listItems[key]]);
        //     break;
        case "mobile":
          _itemsMap.set(4, ["手机号", listItems[key]]);
          break;
        case "type":
          _itemsMap.set(5, ["交易类型", listItems[key]]);
          break;
        case "tradeCard":
          _itemsMap.set(6, ["交易油卡", listItems[key]]);
          break;
        case "method":
          _itemsMap.set(7, ["交易方式", listItems[key]]);
          break;
        case "time":
          _itemsMap.set(8, ["交易时间", listItems[key]]);
          break;
        // case 'gift':
        //     if (listItems.gift != '-') {
        //         _itemsMap.set(9, ['赠送优惠券', listItems[key]]);
        //     }
        //     break;
        case "afterTradeMoney":
          _itemsMap.set(10, [
            "交易后余额",
            `￥${Number(listItems[key]).toFixed(2)}`
          ]);
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
    sortKeys.map(_item => {
      return itemsMap.set(_item, _itemsMap.get(_item));
    });
    this.setState({
      itemsMap: itemsMap
    });
  };

  /**
   * 获取充值明细
   */
  GetRechargeDetailInfo = () => {
    const id = this.props.params.id;
    const merchantId = this.props.query.merchantId;
    // 微信公众号跳转过来保存商户ID
    if (merchantId) {
      sessionStorage.setItem("wxmerchantId", merchantId);
    }
    setTimeout(() => {
      RechargeService.GetRechargeDetailInfo(id).then(res => {
        if (res != null) {
          let result = {
            amount: res.amount,
            flag: res.tradeType,
            mobile: res.mobile || "-",
            type: getRechargeType(res.tradeType) || "-",
            tradeCard: res.cardSpecText || "-",
            method: res.payEntryText || "-",
            time: moment(res.tradeTime).format("YYYY.MM.DD HH:mm:ss") || "-",
            afterTradeMoney: res.postTradingBalance != null ? res.postTradingBalance : 0
          };
          // 修改页面Title
          this.GetPageTitle(result.type);
          this.setState({ listItems: result }, () => {
            this.bindMap();
          });
        }
      });
    }, 300);
  };

  /**
   * 获取数据金额
   */
  getNumber = listItems => {
    switch (listItems.flag) {
      case 1:
      case 3:
      case 4:
        return listItems.amount;
      case 2:
        return 0 - listItems.amount;
      default:
        return 0;
    }
  };

  render() {
    const { listItems, itemsMap } = this.state;

    const { history } = this.props;

    return (
      <QueueAnim style={{height:'100%'}} type={['right', 'left']} delay={200} duration={1500} leaveReverse={true} forcedReplay={true}>
        <div className="animated fadeIn grey-back store-detail-container" key="store-detail">
          <StorePointDetail
            type="store"
            itemsMap={itemsMap}
            history={history}
            number={this.getNumber(listItems)}
          />
        </div>
      </QueueAnim>
    );
  }
}

export default connect(
  state => ({
    MemberInfo: state.MemberInfo
  }),
  {}
)(StoredValueDetail);
