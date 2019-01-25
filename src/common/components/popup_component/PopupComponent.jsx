/*
 * PopupComponent：弹窗组件
 *
 * 1. visible：弹窗是否可见，默认为false
 * 2. onClose：点击下方x号的回调函数，
 * 3. direction：内容区的排列，可取值为center/flex-start/flex-end，与flex的align-items的取值一致
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import popup_close from '@/common/components/popup_component/assets/images/popup_close.png';

class PopupComponent extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        onClose: PropTypes.func.isRequired,
        direction: PropTypes.oneOf(['center', 'flex-start', 'flex-end'])
    };

    static defaultProps = {
        visible: false
    };

    render() {
        const {
            visible,
            onClose,
            direction,
            children
        } = this.props;

        const style = {
            display: 'none'
        };

        return (
            <div className="animated fadeIn popup-component-container" style={visible?{}:style}>
                <div className="popup-component-content-box" style={{alignItems: direction}}>
                    <div className="popup-component-content">
                        {children}
                        <div className="icon-box">
                            <img className="close-icon" src={popup_close} alt="" onClick={onClose} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopupComponent;