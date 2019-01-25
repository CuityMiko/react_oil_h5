/**
 * 获取充值类型
 * 1-充值 2-充值卡消费 3-退款退回 4-充值赠送;
 */
export function getRechargeType(type) {
    switch (type) {
        case 1:
            return '充值';
        case 2:
            return '充值卡消费';
        case 3:
            return '退款退回';
        case 4:
            return '充值赠送';
        default:
            return '-';
    }
}