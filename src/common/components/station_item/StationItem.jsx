/*
 * StationItem组件：用于适用油站的数据展示
 *
 * 1. stationItem：（必填）
 *          - stationName：加油站名称
 *          - address： 加油站地址
 *          - tel：加油站电话
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BorderItem from '@/common/components/border_item/BorderItem';

import tel_icon from '@/common/components/station_item/assets/images/tel_icon.png';
import tel_disable_icon from '@/common/components/station_item/assets/images/tel_disable_icon.png';

class StationItem extends Component {
    static propTypes = {
        stationItem: PropTypes.object.isRequired
    };

    render() {
        const {
            stationName,
            address,
            tel
        } = this.props.stationItem;

        return (
            <div className="station-item-container">
                <div className="content">
                    <div className="left-content">
                        <BorderItem text={stationName} customClass="station-border-item" />
                        <div className="address">{address}</div>
                    </div>
                    <div className="right-content">
                        <div className="border"></div>
                        {tel===''?(<img className="tel-icon" src={tel_disable_icon} alt="" />):(<a href={`tel:${tel}`}><img className="tel-icon" src={tel_icon} alt="" /></a>)}
                    </div>
                </div>
            </div>
        )
    }
}

export default StationItem;