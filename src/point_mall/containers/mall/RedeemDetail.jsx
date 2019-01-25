import React, { Component } from 'react';
import { WhiteSpace, WingBlank } from 'antd-mobile';
import moment from 'moment';
import {connect} from 'react-redux';

import Field from '@/common/components/field/Field';
import DetailBanner from '@/point_mall/containers/mall/components/detail_banner/DetailBanner';
import DetailItem from '@/common/components/detail_item/DetailItem';
import StationContent from '@/common/components/station_content/StationContent';
import info_icon from '@/base/assets/images/info_icon.png';
import default_bg from '@/common/components/card/assets/images/default_bg.png';
import MallService from '@/point_mall/services/mall/mall.service';
import QRBarCode from '@/common/components/qrbarcode/QRBarCode';
import scan_icon from '@/point_mall/assets/images/scan.png';
import warn_icon from '@/point_mall/assets/images/warn.png';
import code_used_img from '@/point_mall/assets/images/code_used.png';

class RedeemDetail extends Component {
    constructor() {
        super();
        this.timer = 0;
    }

    state = {
        infoItems: new Map(),
        goodsdetail: null,
        redeemRecord: null // 兑换记录 status: 已提货1，未提货0
    };

    componentWillMount() {
        const _self = this;
        // 获取商品兑换记录
        _self.GetGoodsRedeemRecord((record) => {
            if (record != null) {
                // 获取商品详情
                _self.GetGoodsDetail(record.scoreExchangeId);
            }
        })
        // 监听核销状态
        _self.listenStatus();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    /**
     * 获取商品兑换记录
     */
    GetGoodsRedeemRecord = (callback) => {
        const _self = this;
        MallService.GetGoodsRedeemRecord(this.props.params.id).then(res => {
            if (res && res.status == 1) {
                clearInterval(_self.timer);
            }
            _self.setState({redeemRecord: res});
            if (callback) {
                callback(res)
            }
        })
    }

    /**
     * 监听核销状态
     */
    listenStatus = () => {
        this.timer = setInterval(() => {
            this.GetGoodsRedeemRecord();
        }, 1000)
    }

    /**
     * 获取商品详情
     */
    GetGoodsDetail = (id) => {
        const _self = this;
        MallService.GetGoodsDetail(id).then(res => {
            if (res) {
                let goodsdetail = {
                    goodsName: res.goodsName || '-',
                    goodsImg: res.imageUrls ? res.imageUrls[0] : '',
                    count: res.count || 0,
                    desc: res.desc || '-',
                    id: res.id,
                    price: res.price,
                    score: res.score,
                    startTime: res.startTime ? moment(res.startTime).format('YYYY.MM.DD HH:mm') : '-',
                    endTime: res.endTime ? moment(res.endTime).format('YYYY.MM.DD HH:mm') : '-'
                }
                _self.setState({
                    infoItems: _self.bindInfoItems(goodsdetail),
                    goodsdetail
                })
            }
        })
    }

    // 处理兑换说明
    bindInfoItems = (data) => {
        return (new Map()).set('', data.desc)
    };

    /**
     * 获取油站
     */
    GetStation = () => {
        try {
            const {MerchantInfo} = this.props;
            let stationItems = [
                {
                    stationName: MerchantInfo.name,
                    address: MerchantInfo.address,
                    tel: MerchantInfo.contactMobile
                }
            ]
            return stationItems;
        } catch (error) {
            return []
        }
    }

    /**
     * 获取提货码
     */
    GetCode = () => {
        const {redeemRecord} = this.state;
        if (redeemRecord != null) {
            if (redeemRecord.status == 0) { // 未提货
                return (
                    <div className="detail-content">
                        <WingBlank size="sm">
                            <Field imgSrc={scan_icon} text="提货码" children={redeemRecord && redeemRecord.code.toString() ? redeemRecord.code : '-'} customClass="mall-detail-field" />
                            <QRBarCode codeVal={redeemRecord && redeemRecord.code ? redeemRecord.code.toString() : '-'} codeType="jsbarcode"/>
                            <div className="mall-code">
                                <img className="icon-img" src={warn_icon} />
                                <span>请凭提货码前往线下油站拿货</span>
                            </div>
                        </WingBlank>
                    </div>
                )
            } else { // 已提货
                return (
                    <div className="detail-content">
                        <WingBlank size="sm">
                            <Field imgSrc={scan_icon} text="提货码" children={redeemRecord && redeemRecord.code ? redeemRecord.code : '-'} customClass="mall-detail-field" />
                            <QRBarCode codeVal={redeemRecord && redeemRecord.code ? redeemRecord.code : '-'} codeType="jsbarcode"/>
                            <img src={code_used_img} className="has-used-icon"/>
                            <WhiteSpace size="xs" />
                        </WingBlank>
                    </div>
                )
            }
        } else {
            return <div></div>
        }
    }

    /**
     * 获取内容
     */
    GetContent = () => {
        const {
            infoItems,
            goodsdetail
        } = this.state;
        const stationItems = this.GetStation();
        if (goodsdetail != null) {
            return (
                <div className="animated fadeIn grey-back mall-detail-container">
                    <DetailBanner img={goodsdetail.goodsImg || default_bg} name= {goodsdetail.goodsName}>
                    </DetailBanner>
                    {this.GetCode()}
                    <WhiteSpace size="xs" />
                    <div className="detail-content">
                        <WingBlank size="sm">
                            <DetailItem detailItems={infoItems}>
                                <Field imgSrc={info_icon} text="兑换说明" customClass="mall-detail-field" />
                            </DetailItem>
                        </WingBlank>
                    </div>
                    <WhiteSpace size="xs" />
                    <StationContent stationItems={stationItems} fieldName="兑换油站" customClass="mall-detail-station-content">
                    </StationContent>
                </div>
            )
        } else {
            return <div></div>
        }
    }

    render() {
        return this.GetContent();
    }
}

export default connect(state => ({
    MerchantInfo: state.MerchantInfo,
    MemberInfo: state.MemberInfo
}), {})(RedeemDetail);