/*
 * PageDetail组件：用于会员卡详情展示
 *  1. data：map形式的数据，必填
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { WingBlank, WhiteSpace } from 'antd-mobile';

class PageDetail extends Component {
    
    static propTypes = {
        data: PropTypes.any.isRequired
    };
    
    render() {
        const {data} = this.props;

        return (
            <WingBlank size="sm">
                <WhiteSpace size="md" />
                <div className="card-detail-container">
                    {
                        [...data].map((item, index) => {
                            return (
                                <div className="detail-items" key={index}>
                                    <label className="items-label">{item[0]}</label>
                                    <div className="text">
                                        {(item[0].indexOf('手机') > -1 || item[0].indexOf('电话') > -1 || item[0].indexOf('tel') > -1) ? (<a className="tel" href={`tel:${item[1]}`}>{item[1]}</a>) : item[1]}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </WingBlank>
        )
    }
}

export default PageDetail;