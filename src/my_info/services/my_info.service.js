/**
 * 个人信息业务服务
 */
import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {GetPersonalInfoUrl, UpdatePersonalInfoUrl} from './my_info.url';

/**
 * 获取个人信息
 * @param {*} memberid 用户ID
 */
const GetPersonalInfo = function (memberid) {
    const deferred = q.defer();
    const url = `${GetPersonalInfoUrl}/${memberid}`;
    httpHelper.get(url).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 更新个人信息
 */
const UpdatePersonalInfo = function (data) {
    const deferred = q.defer();
    httpHelper.post(UpdatePersonalInfoUrl, data).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    GetPersonalInfo,
    UpdatePersonalInfo
}

