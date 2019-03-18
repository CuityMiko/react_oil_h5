/**
 * 操作cookie
 */
import Cookies from 'js-cookie';

/**
 * 设置cookie
 * @param {*} name 
 * @param {*} value 
 * @param {*} expires 默认15天
 */
export function set(name, value, expires = 15) {
    Cookies.set(name, value, {expires: expires, path: ''})
}

/**
 * 获取cookie
 * @param {*} name 
 */
export function get(name) {
    let _val = Cookies.get(name);
    if (_val) {
        return _val;
    } else {
        return '';
    }
}

/**
 * 删除cookie
 * @param {*} name 
 */
export function remove(name) {
    Cookies.remove(name);
}