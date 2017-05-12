import cookies from '../../framework/common/Cookie.js';
import {message} from 'antd';
import Common from '../common.jsx';

let mchId = Common.currentPosition.isMerchant() ? Common.getMerchantID.byUrl() : '';

function responseFilter(response) {
    if (response.status === 400) {
        if(response.body.code === 10002) { // 登录过期
            if(window.location.pathname === '/') {
                Common.goToLogin('进入到了首页，自动跳转到登录页');
                // window.location.href = '/sessions/new';
            }else {
                window.location.href = '/sessions/new?next=' + encodeURIComponent(window.location.pathname);
            }
        }else if(response.body.code === 20001) { // 商户越界
            return response
        }else{
            return response
        }
    }else{
        return response
    }
}

export default function(url, options={},notUseMchId) {

    //add xsrftoken to headers
    if(options['headers'] === undefined){
        options['headers'] = {};
    }
    options['headers']['X-Xsrftoken']= cookies.getCookie('_xsrf');
    options['credentials'] = "same-origin";
    console.log(notUseMchId);
    let localUrl = window.location.host;
    if(notUseMchId) {
        return fetch('http://' + localUrl + url, options)
            .then(responseFilter)
            .catch(function(error) {
                message.error('网络错误,请手动刷新后重试',24*60*60);
                console.log('request failed', error)
            })
    }else {
        return fetch('/api/m/' + mchId + url, options)
            .then(responseFilter)
            .catch(function(error) {
                message.error('网络错误,请手动刷新后重试',24*60*60);
                console.log('request failed', error)
            })
    }
};
