import React, {Component} from 'react';
import {connect} from "react-redux";

import PageDetail from '@/member_card/components/PageDetail';

import memberCardService from '@/member_card/services/member_card.service';

class CardDetail extends Component {
    state = {
        detailItems: new Map()
    };

    componentDidMount() {
        const _this = this;
        const { MerchantInfo } = this.props;
        memberCardService.getMemberCardDetail(MerchantInfo.id)
            .then((res) => {
                _this.setState({
                    detailItems: res
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }
    
    render() {
        const { detailItems } = this.state;

        return (
            <PageDetail data={detailItems} />
        );
    }
}

export default connect(state => ({
    MerchantInfo: state.MerchantInfo
}), {})(CardDetail);