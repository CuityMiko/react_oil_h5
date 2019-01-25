/*
 * PointIntro：积分须知弹窗
 */

import React, { Component } from 'react';
import { WingBlank } from 'antd-mobile';

import DetailItem from '@/common/components/detail_item/DetailItem';
import BorderItem from '@/common/components/border_item/BorderItem';
import './point_intro.less';
import PointDetailService from '@/point_mall/services/point_detail/point_detail.service';

class PointIntro extends Component {
    state = {
        contents: []
    };

    componentWillMount() {
        const _self = this;
        // 获取积分须知
        PointDetailService.GetPointInformation().then(res => {
            _self.bindPointInformation(res);
        })
    }

    /**
     * 绑定积分须知
     */
    bindPointInformation = (result) => {
        let contents = [];
        let item0 = {
            id: 0,
            name: '开卡',
            content: ['开卡/注册手机号赠100积分']
        }
        contents.push(item0);
        if (result != null && result.length >= 2) {
            if (result[0] != null && result[0].length > 0) { // 汽油卡
                let item1 = {
                    id: 1,
                    name: '汽油卡',
                    content: []
                }
                result[0].map(rule => {
                    if (rule.skuResponses != null && rule.skuResponses.length > 0) {
                        rule.skuResponses.map(sku => {
                            if (sku && sku.skuName) {
                                item1.content.push(`${sku.skuName}每消费${rule.amount}元赠送${rule.score}`);
                            }
                        })
                    }
                })
                contents.push(item1);
            }
            if (result[1] != null && result[1].length > 0) { // 汽油卡
                let item2 = {
                    id: 2,
                    name: '柴油卡',
                    content: []
                }
                result[1].map(rule => {
                    if (rule.skuResponses != null && rule.skuResponses.length > 0) {
                        rule.skuResponses.map(sku => {
                            if (sku && sku.skuName) {
                                item2.content.push(`${sku.skuName}每消费${rule.amount}元赠送${rule.score}`);
                            }
                        })
                    }
                })
                contents.push(item2);
            }
        }
        this.setState({contents})
    }

    bindItems = (data) => {
        let result = new Map();
        if (data && data.length > 0) {
            data.map((item, index) => {
                result.set(`--${index}`, item);
            })
        }
        return result;
    };

    render() {
        const {contents} = this.state;
        return (
            <div className="point-intro-container">
                <div className="title">
                    <WingBlank size="md">
                        积分须知
                    </WingBlank>
                </div>
                <div className="line"></div>
                <div className="content">
                    <WingBlank size="md">
                        {
                            contents.map((item, index) => {
                                if (item.id > 0) {
                                    return (
                                        <div key={index}>
                                            <BorderItem text={item.name} customClass="border-item" />
                                            <DetailItem detailItems={this.bindItems(item.content)} customClass="detail-items" />
                                        </div>
                                    )
                                } else {
                                    return <DetailItem detailItems={this.bindItems(item.content)} customClass="detail-items" key={index}/>
                                }
                            })
                        }
                    </WingBlank>
                </div>
            </div>
        )
    }
}

export default PointIntro;