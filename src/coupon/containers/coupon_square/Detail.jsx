import React, { Component } from 'react';
import { WingBlank, WhiteSpace, Toast } from 'antd-mobile';
import moment from 'moment';
import {connect} from 'react-redux';

import Field from '@/common/components/field/Field';
import MobileButton from '@/common/components/mobile_button/MobileButton';
import DetailItem from '@/common/components/detail_item/DetailItem';
import StationContent from '@/common/components/station_content/StationContent';
import CountDown from '@/coupon/components/count_down/CountDown';
import PopupComponent from '@/common/components/popup_component/PopupComponent';
import share_icon from '@/coupon/assets/images/share_icon.png';
import share_popup from '@/coupon/assets/images/share_popup.png';
import has_used_icon_lg from '@/coupon/assets/images/has_used_icon_lg.png';
import invalid_icon_lg from '@/coupon/assets/images/invalid_icon_lg.png';
import info_icon from '@/base/assets/images/info_icon.png';
import introduction_icon from '@/base/assets/images/introduction_icon.png';
import CouponService from '@/coupon/services/coupon.service';
import {matchNumber} from '@/base/utils/index';
import {GetMemberInfoAction} from '@/base/redux/actions';

class CouponDetail extends Component {
    state = {
        infoItems: new Map(),
        introductionItems: new Map(),
        couponObj: {},
        modal: false // 分享弹窗默认不可见
    };

    componentDidMount() {
        // 获取卡片详情
        this.GetCouponDetail();
    }

    /**
     * 判断时段
     */
    judgeTime = (useTimeWeek, useTimeHour) => {
        if (useTimeWeek == '1,2,3,4,5,6,7' && useTimeHour == '00:00-23:59') {
            return '全部时段';
        } else {
            return `${useTimeHour}（${this.getWeekName(useTimeWeek)}）`
        }
    }

    /**
     * 获取使用星期大写
     */
    getWeekName = (useTimeWeek) => {
        if (useTimeWeek != null) {
            let arr = useTimeWeek.split(',');
            if (arr.length > 0) {
                let newarr = [];
                arr.map(i => {
                    newarr.push(matchNumber(i))
                })
                return newarr.toString();
            }
        }
        return '';
    }

    /**
     * 获取卡券详情
     */
    GetCouponDetail = () => {
        const {params, query} = this.props;
        CouponService.GetCouponDetail({couponId: null, couponNumber: params.id}).then(res => {
            if (res != null) {
                let applyGoods = '';
                let date = '';
                if (res.skus && res.skus.length > 0) {
                    applyGoods = res.skus.filter(s=>s.skuName!=null).map(s=>s.skuName).join('/');
                }
                // dateType 卡券使用有效期类型 0-固定时间 1-立即生效
                if(res.dateType == 0) {
                    date = `${moment(res.useTimeBegin).format('YYYY.MM.DD')} - ${moment(res.useTimeEnd).format('YYYY.MM.DD')}`
                } else if(res.dateType == 1) {
                    // 从卡包过来的话，显示有效日期，否则显示几天内有效
                    if(query.flag && query.flag == 'package') {
                        date = `${moment().format('YYYY.MM.DD')} - ${moment().add(res.fixedTerm-1, 'days').format('YYYY.MM.DD')}`
                    } else {
                        date = `领取后${res.fixedTerm}天有效`
                    }
                }
                this.setState({couponObj: {...res, applyGoods, date}}, () => {
                    this.bindInfo();
                })
            } else {
                
            }
        }).catch(err => {
            setTimeout(() => {
                this.props.history.push('/app/home');
            }, 2000);
        })
    }

    bindInfo = () => {
        const {couponObj} = this.state;
        const data1 = {
            name1: couponObj.applyGoods ? `仅限${couponObj.applyGoods}使用` : '-',
            name2: couponObj.date,
            name3: this.judgeTime(couponObj.useTimeWeek, couponObj.useTimeHour),
            name4: `每位用户限领取${couponObj.getLimit >= 99999 ? couponObj.getLimit : '不限'}张`
        };
        const data2 = {
            name1: couponObj.remark
        };
        this.setState((prevState) => {
            return {
                infoItems: this.bindInfoItems(prevState.infoItems, data1),
                introductionItems: this.bindIntroductionItems(prevState.introductionItems, data2)
            }
        });
    }

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

    // 使用须知
    bindInfoItems = (prevMap, data) => {
        return prevMap.set('适用油品：', data.name1)
            .set('有效日期：', data.name2)
            .set('使用时段：', data.name3)
            .set('每人限领：', data.name4)
    };

    // 卡券说明
    bindIntroductionItems = (prevMap, data) => {
        return prevMap.set('', data.name1 || '无')
    };

    // 判断显示的元素
    judge = (couponObj) => {
        const {query} = this.props;
        if ((query.flag && query.flag == 'package') || couponObj.isTake) { // 从用户卡券列表过来
            // status: -1 未领取 0 未使用 1已使用 2已过期 3已冻结
            switch (couponObj.status) {
                case 0:
                    return (
                        <div className="button-box">
                            <MobileButton text="立即使用" buttonClass="longButton" handleClick={() => this.goCToB(couponObj.couponNumber)} />
                        </div>
                    );
                case 1:
                    return (
                        <div className="icon-box">
                            <img src={has_used_icon_lg} alt="" />
                        </div>
                    );
                case 2:
                    return (
                        <div className="icon-box">
                            <img src={invalid_icon_lg} alt="" />
                        </div>
                    );
                default:
                    break;
            }
        } else {
            // 卡券在未领取时又分为四种情况（已抢完，剩余x天未开始，剩余x小时开始，立即抢），做第二次的判断显示
            return this.secondJudge(couponObj);
        }
    };

    /**
     * 去使用
     */
    goToUse = (couponNumber) => {
        this.props.history.push('/app/payment?couponnum=' + couponNumber);
    }

    /**
     * 立即领取
     */
    goToTake = (id) => {
        const {GetMemberInfoAction} = this.props;
        CouponService.TakeCoupon(id).then(res => {
            Toast.success('领取成功', 1, () => {
                // 更新用户状态
                GetMemberInfoAction();
                const {couponObj} = this.state;
                this.setState({
                    couponObj: {...couponObj, status: 0, isTake: true}
                });
            })
        }).catch(err => {
            Toast.fail(err);
        })
    }

    // 判断卡券在未领取的情况下显示什么元素（已抢完，剩余x天未开始，剩余x小时开始，立即抢）
    secondJudge = (couponObj) => {
        let nowTime = moment().format('X');
        let startTime = moment(couponObj.actTimeStart).format('X');
        let endTime = moment(couponObj.actTimeEnd).format('X');

        if (couponObj.availInventory > 0) {
            if (startTime <= nowTime && nowTime <= endTime) {
                // 进行中，立即抢
                return (
                    <div className="button-box">
                        {/* {couponObj.status > -1 ? <MobileButton text="立即使用" buttonClass="longButton" handleClick={() => {this.goToUse(couponObj.couponNumber)}} /> : <MobileButton text="立即领取" buttonClass="longButton" handleClick={() => {this.goToTake(couponObj.id)}} />} */}
                        <MobileButton text="立即领取" buttonClass="longButton" handleClick={() => {this.goToTake(couponObj.id)}} />
                    </div>
                )
            } else if (startTime > nowTime) {
                // 未开始
                let _diff = moment.duration(startTime - nowTime, 'seconds');
                let days = Math.floor(_diff.asDays());
                if(days >= 1) {
                    // 剩余x天开抢
                    // 如果剩余天数大于99天，则显示99天
                    if(days > 99) {
                        days = 99;
                    }
                    return (
                        <div className="day-box">
                            <div className="text">剩余<span className="box box-one">{days}</span><span className="box box-two">天</span>开始</div>
                        </div>
                    )
                } else if (days < 1 ) {
                    // 剩余x时x分x秒开抢
                    return (
                        <div className="count-down-box">
                            剩余<CountDown useScene="detail" startTime={startTime} handleChange={this.handleChange} />开始
                        </div>
                    )
                }
            }
        } else if(couponObj.availInventory <= 0) {
            // 库存为0时显示已被抢完
            return (
                <div className="button-box">
                    <MobileButton text="已被抢完" buttonClass="longButton" disabled handleClick={() => {}} />
                </div>
            )
        }
    };

    // 倒计时结束之后再次请求卡券详情接口render
    handleChange = () => {
        this.GetCouponDetail();
    };

    // 点击分享显示弹窗
    showModal = key => (e) => {
        this.setState({
            [key]: true
        })
    };

    // 关闭弹窗
    onClose = key => (e) => {
        this.setState({
            [key]: false
        })
    };

    // 点击立即使用跳转付款页面
    goCToB = (couponNumber) => {
        this.props.history.push('/app/payment?couponnum=' + couponNumber);
    };

    render() {
        const {
            infoItems,
            introductionItems,
            couponObj,
            modal
        } = this.state;
        const {
            amount,
            leastCost,
            name,
            logo
        } = couponObj;
        const stationItems = this.GetStation();
        return (
            <div className="animated fadeIn coupon-detail-container">
                <div className="coupon-detail-wrap">
                    <WingBlank size="sm">
                        <div className="coupon-detail-box">
                            <div className="coupon-detail-content">
                                <WingBlank size="sm">
                                    <Field text={name || ''} imgSrc={logo} customClass="coupon-detail-share-field">
                                        {/*<div className="field-right-content" onClick={this.showModal('modal')}>*/}
                                        {/*<img className="icon" src={share_icon} alt="" />*/}
                                        {/*<div className="share">分享</div>*/}
                                        {/*</div>*/}
                                    </Field>
                                    <PopupComponent onClose={this.onClose('modal')} visible={modal} direction="flex-start">
                                        <div className="share-popup-container">
                                            <img src={share_popup} alt="" />
                                        </div>
                                    </PopupComponent>
                                    <div className="middle-content">
                                        <div className="money">¥{amount}</div>
                                        <div className="apply-conditions">满{leastCost === 0 ? '任意金额': leastCost}可用</div>
                                        {this.judge(couponObj)}
                                    </div>
                                    <DetailItem detailItems={infoItems}>
                                        <Field imgSrc={info_icon} text="使用须知" customClass="coupon-detail-field" />
                                    </DetailItem>
                                    <WhiteSpace size="xs" />
                                    <DetailItem detailItems={introductionItems}>
                                        <Field imgSrc={introduction_icon} text="卡券说明" customClass="coupon-detail-field" />
                                    </DetailItem>
                                </WingBlank>
                                <WhiteSpace size="xs" />
                                <StationContent stationItems={stationItems} fieldName="适用油站" customClass="coupon-detail-station-content">
                                </StationContent>
                            </div>
                        </div>
                    </WingBlank>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    MerchantInfo: state.MerchantInfo
}), {GetMemberInfoAction})(CouponDetail);