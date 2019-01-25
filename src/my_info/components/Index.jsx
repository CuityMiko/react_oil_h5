import React, {Component} from 'react'

import styles from './my_info_components.module.less'

export default class MYINFOComponent extends Component {
    state = {
        title: '我的信息-组件'
    }

    render() {
        return (
            <div className={styles.hometest}>{this.state.title}</div>
        )
    }
}