import lrz from 'lrz';

/**
 *  页面级别工具类.
 */

// 提供中文数字
let cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
/**
 * 数字转大写
 * @param {*} n 
 */
export const matchNumber = (n) => {
    var s = '';
    n = '' + n; // 数字转为字符串
    for (var i = 0; i < n.length; i++) {
        s += cnum[parseInt(n.charAt(i))];
    }
    if (s.length == 2) { // 两位数的时候
        // 如果个位数是0的时候，令改成十
        if (s.charAt(1) == cnum[0]) {
            s = s.charAt(0) + cnum[10];
            // 如果是一十改成十
            if (s == cnum[1] + cnum[10]) {
                s = cnum[10]
            }
        } else if (s.charAt(0) == cnum[1]) {
            // 如果十位数是一的话改成十
            s = cnum[10] + s.charAt(1);
        }
    }
    return s;
}

/**
 * 获取url的参数
 */
export const queryString = () => {
    let _queryString = {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [ _queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};

/**
 * 获取微信Code
 * @param {*} key 定义key用于缓存code
 * 返回值：0：不需要code 1：拒绝授权微信信息 其他：code
 */
export const getWXCode = (key) => {
   let _search = window.location.search;
   if (_search == '') {
       return 0;
   } else {
       if (_search.indexOf('code') > -1) {
           try {
               let code = _search.split('&')[0].split('=')[1];
               if (sessionStorage.getItem(key) == null) {
                   sessionStorage.setItem(key, JSON.stringify({code: code, isfirst: true}));
               } else {
                   let _wxcode = JSON.parse(sessionStorage.getItem(key));
                   _wxcode.code = code;
                   _wxcode.isfirst = false;
                   sessionStorage.setItem(key, JSON.stringify(_wxcode));
               }
               return code;
           } catch (error) {
               return 2;
           }
       } else {
           if (_search.indexOf('state') > -1) {
               return 1;
           } else {
               return 2;
           }
       }
   }
}

/**
 * 将base64转换为文件
 * @param {*} dataurl base64图片
 * @param {*} filename 文件名称
 */
const dataURLtoFile = (dataurl, filename) => {
   var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
   bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
   while(n--){
       u8arr[n] = bstr.charCodeAt(n);
   }
   return new File([u8arr], filename, {type:mime});
}

/**
 * 图片压缩
 * @param {*} file 上传file对象或base64url
 * @param {*} quality 压缩质量
 * @param {*} callback 解压后的回调
 */
export const imageCompress = (file, quality, callback) => {
    try {
        lrz(file, {quality}).then((rst) => {
            let currfile = dataURLtoFile(rst.base64, file.name);
            callback(currfile);
        })  
    } catch (error) {
        callback(null);
    }
}

/**
 * 将base64转换为文件
 * @param {*} dataurl base64图片
 * @param {*} filename 文件名称
 */
export const base64ToFile = (dataurl, filename) => {
    return dataURLtoFile(dataurl, filename);
}

