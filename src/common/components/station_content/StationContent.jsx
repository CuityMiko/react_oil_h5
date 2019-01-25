/*
 * StationContent组件：用于适用油站的数据展示
 *
 * 1. stationItems：适用油站的数据数组，（必填）
 * 2. fieldName：field文本（必填）
 * 3. customClass：提供自定义的样式类，
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { WingBlank } from 'antd-mobile';

import Field from '@/common/components/field/Field';
import StationItem from '@/common/components/station_item/StationItem';

import station_icon from '@/base/assets/images/station_icon.png';

class StationContent extends Component {
    static propTypes = {
        stationItems: PropTypes.array.isRequired,
        fieldName: PropTypes.string.isRequired,
        customClass: PropTypes.string
    };

    render() {
        const {
            stationItems,
            customClass,
            fieldName
        } = this.props;

        const stationContentClass = classnames('station-content-container', customClass);

        return (
            <div className={stationContentClass}>
                <WingBlank size="sm">
                    <Field imgSrc={station_icon} text={fieldName} customClass="field-class" />
                    {
                        stationItems.map((stationItem, index) => {
                            return (
                                <StationItem stationItem={stationItem} key={index} />
                            )
                        })
                    }
                </WingBlank>
            </div>
        )
    }
}

export default StationContent;