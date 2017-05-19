import cookies from '../../framework/common/Cookie.js';
import {message} from 'antd';
import Common from '../common.jsx';

function responseFilter(response) {
    if (response.status === 400) {
        return response;
    }else{
        return response;
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
        return fetch('/api/m/' + url, options)
            .then(responseFilter)
            .catch(function(error) {
                message.error('网络错误,请手动刷新后重试',24*60*60);
                console.log('request failed', error)
            })
    }
};
