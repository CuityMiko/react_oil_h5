/*
 * CountDown: 倒计时组件
 *
 * 1. startTime：活动的开始时间
 * 2. useScene：使用场景， - list：用于卡券广场的倒计时展示（默认）
 *                        - detail：用于卡券详情的倒计时展示
 * 3. handleChange：倒计时结束之后进行的回调函数
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';

import './count_down.less';

class CountDown extends Component {
    static propTypes = {
        startTime: PropTypes.string.isRequired,
        useScene: PropTypes.oneOf(['list', 'detail']),
        handleChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        useScene: 'list'
    };

    state = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        intervalId: 0
    };

    componentDidMount() {
        this.countDown();
    }

    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.state.intervalId);
    }

    // 开启倒计时
    countDown = () => {
        const {
            startTime,
            handleChange
        } = this.props;

        // 将现在的时间格式化为秒级的时间戳
        let nowTime = moment().format('X');
        // 后端传回的时间戳为毫秒级别，在这里做秒级的时间戳转换
        let _diff = moment.duration(startTime - nowTime, 'seconds');
        let hours = _diff.hours();
        let minutes = _diff.minutes();
        let seconds = _diff.seconds();
        this.setState({
            hours,
            minutes,
            seconds
        });

        const intervalId = setInterval(() => {
            _diff = moment.duration(_diff.asSeconds() - 1, 'seconds');

            if (_diff.asSeconds() <= 0) {
                handleChange();
                clearInterval(intervalId);
            }
            this.setState({
                hours: _diff.hours(),
                minutes: _diff.minutes(),
                seconds: _diff.seconds()
            });
        }, 1000);

        this.setState({
            intervalId
        });
    };

    render() {
        const {
            useScene
        } = this.props;

        const {
            hours,
            minutes,
            seconds
        } = this.state;

        const containerClass = classnames({
            'count-down-list-container': useScene === 'list',
            'count-down-detail-container': useScene === 'detail'
        });

        return (
          <div className={containerClass}>
              <span className="number">{hours}</span>
              <span className="colon">:</span>
              <span className="number">{minutes}</span>
              <span className="colon">:</span>
              <span className="number">{seconds}</span>
          </div>
        )
    }
}

export default CountDown;