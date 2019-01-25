/**
 * 公共基础服务
 */
import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {SendCodeUrl, UploadUrl, GetSendCodeUrl} from './common.url';

/**
 * 发送短信验证码
 * @param {*} mobile 
 * @param {*} type 发送短信类型 LOGIN: '登录'（默认） RESET_PWD: '重置密码'
 */
const SendCode = function (mobile, type = 'LOGIN') {
    const params = Object.assign({}, {mobile, type});
    const deferred = q.defer();
    httpHelper.post(SendCodeUrl, params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 上传文件
 * @param {*} file
 */
const Upload = function (file) {
    const deferred = q.defer();
    let formData = new FormData();
    formData.append("files", file);
    httpHelper.post(UploadUrl, formData).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 获取短信验证码
 */
const GetSendCode = function (mobile) {
    const deferred = q.defer();
    const url = `${GetSendCodeUrl}?mobile=${mobile}`
    httpHelper.get(url).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    SendCode,
    Upload,
    GetSendCode
}