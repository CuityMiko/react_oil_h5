import React, {Component} from 'react';
import { WhiteSpace } from 'antd-mobile';

class OilCardComponent extends Component {
    state = {
        title: '油卡-组件'
    };
    
    render() {
        const {title} = this.state;
        return (
            <div>
                <WhiteSpace size="lg" />
                <h3>{title}</h3>
            </div>
        );
    }
}

export default OilCardComponent;