/**
 * 获取积分类型
 * 0积分累计(消费赠送) 1积分兑换 2充值赠送 3退款扣除 4.开卡注册; 
 */
export function getPointType(type) {
    switch (type) {
        case 0:
            return '消费赠送';
        case 1:
            return '积分兑换';
        case 2:
            return '充值赠送';
        case 3:
            return '退款扣除';
        case 4:
            return '开卡注册';
        default:
            return '-';
    }
}