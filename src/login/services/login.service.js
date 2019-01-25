/**
 * 登录接口服务
 */
import q from 'q';

import httpHelper from '@/base/axios/http_helper';
// 登录url
import {LoginUrl, EntryUrl, PreLoginUrl} from './login.url';

/**
 * 登录
 * @param {*} data
 */
const Login = function (data) {
    const params = Object.assign({}, {...data});
    const deferred = q.defer();
    httpHelper.post(LoginUrl, params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 入口服务
 * @param {*} merchantid 
 */
const Entry = (merchantid) => {
    const deferred = q.defer();
    let url = `${EntryUrl}/${merchantid}`
    httpHelper.post(url, {}, {isLoading: false}).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 预登录（微信跳转回来带有微信code）
 * @param {*} wxcode 微信code
 * @param {*} merchantId 商户ID
 */
const PreLogin = (code, merchantId) => {
    const params = Object.assign({}, {code, merchantId});
    const deferred = q.defer();
    httpHelper.post(PreLoginUrl, params, {isLoading: false}).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    Login,
    Entry,
    PreLogin
}