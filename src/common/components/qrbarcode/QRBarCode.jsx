/**
 * 二维码 / 条形码组件
 * 参数：
 *  1、codeVal：码值
 *  2、codeType：码类型（qrcode：二维码、jsbarcode：条形码）
 */
import React from 'react';
import PropTypes from 'prop-types';
import * as QrCode from 'qrcode.react';
import * as Barcode from 'jsbarcode';

import styles from './qrbarcode.module.less';

class QRBarCode extends React.Component {
    constructor() {
        super();
        this.barcode = '';
    }

    static propTypes = {
        codeVal: PropTypes.string,
        codeType: PropTypes.oneOf(['qrcode', 'jsbarcode'])
    }

    componentDidMount() {
        // 初始化条形码
        const {codeVal} = this.props;
        Barcode(this.barcode, codeVal, {
            displayValue: false,
            width: 3.6,
            height: 100,
            margin: 0
        })
    }

    /**
     * 获取码
     */
    GetCode = () => {
        const {codeType, codeVal} = this.props;
        if (codeType == 'qrcode') { // 二维码
            return (
                <div className={styles.qrbarcode}>
                    <QrCode value={codeVal} size={120} />
                </div>
            )
        } else { // 条形码
            return (
                <div className={styles.barcodebox}>
                    <svg ref={(ref)=>this.barcode = ref}></svg>
                </div>
            )
        }
    }

    render() {
        return this.GetCode();
    }
}

export default QRBarCode;