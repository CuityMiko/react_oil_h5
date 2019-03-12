import React, { Component } from 'react';
import { WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import moment from 'moment';
import {connect} from 'react-redux';

import Field from '@/common/components/field/Field';
import DetailBanner from '@/point_mall/containers/mall/components/detail_banner/DetailBanner';
import DetailItem from '@/common/components/detail_item/DetailItem';
import StationContent from '@/common/components/station_content/StationContent';
import BottomContent from '@/common/components/bottom_content/BottomContent';
import MobileButton from '@/common/components/mobile_button/MobileButton';
import goods_remain_icon from '@/point_mall/assets/images/goods_remain_icon.png';
import info_icon from '@/base/assets/images/info_icon.png';
import default_bg from '@/common/components/card/assets/images/default_bg.png';
import MallService from '@/point_mall/services/mall/mall.service';
import {GetMemberInfoAction} from '@/base/redux/actions';

class MallDetail extends Component {
    state = {
        infoItems: new Map(),
        goodsdetail: null
    };

    componentWillMount() {
        // 获取商品详情
        this.GetGoodsDetail();
    }

    /**
     * 获取商品详情
     */
    GetGoodsDetail = () => {
        const _self = this;
        MallService.GetGoodsDetail(this.props.params.id).then(res => {
            if (res) {
                let goodsdetail = {
                    goodsName: res.goodsName || '-',
                    goodsImg: res.imageUrls ? res.imageUrls[0] : '',
                    count: res.count || 0,
                    desc: res.desc || '-',
                    id: res.id,
                    price: res.price,
                    score: res.score,
                    startTime: res.startTime ? moment(res.startTime).format('YYYY.MM.DD') : '-',
                    endTime: res.endTime ? moment(res.endTime).format('YYYY.MM.DD') : '-'
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
        return (new Map()).set('兑换时间：', `${data.startTime} - ${data.endTime}`)
            .set('使用说明：', data.desc)
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
     * 立即兑换
     */
    redeemClick = () => {
        const _self = this;
        const {GetMemberInfoAction} = _self.props;
        MallService.RedeemGoods(_self.props.params.id).then(res => {
            Toast.info('兑换成功', 1, () => {
                // 更新会员信息状态
                GetMemberInfoAction();
                _self.props.history.push(`/app/mall/redeemdetail/${res.recordId}`);
            });
        })
    }

    /**
     * 获取底部按钮
     */
    GetBottomBtn = (score) => {
        const {MemberInfo} = this.props;
        if (MemberInfo.availableScore >= score) {
            return <MobileButton text="立即兑换" buttonClass="longButton" customClass="bottom-button" handleClick={this.redeemClick} />
        } else {
            return <MobileButton text="积分不足" disabled buttonClass="longButton" customClass="bottom-button" handleClick={this.redeemClick} />
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
                        <Field text={`仅剩${goodsdetail.count}件`} customClass="detail-banner-field" imgSrc={goods_remain_icon} />
                    </DetailBanner>
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
                    <BottomContent>
                        <div className="text">
                            <div className="score"><span>{goodsdetail.score}</span>积分</div>
                            <div className="money">¥{Number(goodsdetail.price).toFixed(2)}</div>
                        </div>
                        <div className="button">
                            {this.GetBottomBtn(goodsdetail.score)}
                        </div>
                    </BottomContent>
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
}), {GetMemberInfoAction})(MallDetail);