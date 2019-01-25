import React, {Component} from 'react';
import PropTypes from "prop-types";
import classnames from 'classnames';

import './add_new_card.less'

class AddNewCard extends Component {
    static propTypes = {
        imgSrc: PropTypes.string,
        text: PropTypes.string,
        customClass: PropTypes.string,
        onClick: PropTypes.func,
    };

    // 默认的props
    static defaultProps = {
        imgSrc: '',
        text: '添加卡'
    };

    render() {
        const {
            imgSrc,
            text,
            customClass,
            onClick
        } = this.props;

        const addNewCardClass = classnames('add-new-card', customClass);

        return (
            <div className={addNewCardClass} onClick={onClick}>
                {
                    imgSrc ? (<img className="icon-img" src={imgSrc} alt="" />) : ('')
                }
                <span className="subtext">{text}</span>
            </div>
        );
    }
}

export default AddNewCard;