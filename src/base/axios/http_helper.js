import request from './http';
import q from 'q';
import { Toast } from 'antd-mobile';

/**
 * 封装get方法
 */
const get = function (url, params = {}, headers = {}) {
    const deferred = q.defer();
    request({
        url,
        method: 'get',
        params,
        headers: headers
    }).then((res) => {
        try {
            if (res.data && res.data.success) {
                deferred.resolve(res.data.data);
            } else {
                const errmsg = res.data.errMsg || '请求异常，请稍后再试!';
                Toast.fail(errmsg);
                deferred.reject(errmsg);
            }
        } catch (error) {
            deferred.reject(error);
        }
    }).catch((err) => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 封装post方法
 */
const post = function (url, data = {}, headers = {}) {
    const deferred = q.defer();
    request({
        url,
        method: 'post',
        data,
        headers: headers
    }).then((res) => {
        if (res.data && res.data.success) {
            deferred.resolve(res.data.data);
        } else {
            try {
                if (res.data && res.data.success) {
                    deferred.resolve(res.data.data);
                } else {
                    const errmsg = res.data.errMsg || '请求异常，请稍后再试!';
                    Toast.fail(errmsg);
                    deferred.reject(errmsg);
                }
            } catch (error) {
                deferred.reject(error);
            }
        }
    }).catch((err) => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 封装get方法带有success返回
 */
const getWithres = function (url, params = {}, headers = {}) {
    const deferred = q.defer();
    request({
        url,
        method: 'get',
        params,
        headers
    }).then((res) => {
        deferred.resolve(res.data);
    }).catch((err) => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 封装post方法带有success返回
 */
const postWithRes = function (url, data = {}, headers = {}) {
    const deferred = q.defer();
    request({
        url,
        method: 'post',
        data,
        headers
    }).then((res) => {
        deferred.resolve(res.data);
    }).catch((err) => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    get,
    post,
    getWithres,
    postWithRes
}