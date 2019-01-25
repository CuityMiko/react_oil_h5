import axios from 'axios'
// import store from '@/store'
import {Toast} from 'antd-mobile'

// 创建axios实例
const service = axios.create({
  timeout: 50000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // config.url = config.url.replace('h5', 'consumer');
  if (config.headers.isLoading == undefined) {
    Toast.loading('加载中...');
  }
  // 设置请求报文头
  if (localStorage.getItem('user-token')) {
    config.headers['token'] = localStorage.getItem('user-token');
  }
  return config
}, error => {
  // 提示错误信息
  Toast.fail(error.message)
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    Toast.hide();
    if (response.data.errCode == '000006') { // 登录过期
      try {
        sessionStorage.setItem('JumpRoute', window.location.hash.substring(1, window.location.hash.length));
        if (sessionStorage.getItem('merchantinfo')) {
          window.location.href = `${window.location.origin}#/app/login/${JSON.parse(sessionStorage.getItem('merchantinfo')).id}`;
        } else {
          window.location.href = `${window.location.origin}#/app/login`;
        }
      } catch (error) {
        Toast.fail('系统错误');
      }
    }
    return response;
  },
  error => {
    // 提示错误信息
    Toast.fail(error.message)
    return Promise.reject(error)
  }
)

export default service
