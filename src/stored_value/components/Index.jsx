import React, {Component} from 'react';
import { WhiteSpace } from 'antd-mobile';

class Index extends Component {
    state = {
        title: '充值-组件'
    }
    
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