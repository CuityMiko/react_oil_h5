import React, {Component} from 'react';
import {connect} from "react-redux";
import QueueAnim from 'rc-queue-anim';

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
            <QueueAnim style={{height:'100%'}} type={['right', 'left']} delay={200} duration={1500} leaveReverse={true} forcedReplay={true}>
                <PageDetail data={detailItems} key="card_detail"/>
            </QueueAnim>
        );
    }
}

export default connect(state => ({
    MerchantInfo: state.MerchantInfo
}), {})(CardDetail);