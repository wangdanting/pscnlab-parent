import superagent from 'superagent';
import cookies from '../../framework/common/Cookie.js';
import Common from '../common.jsx';

//let requestList = [];
let mchId = Common.currentPosition.isMerchant() ? Common.getMerchantID.byUrl() : '';
let timeOutValue = 100000;

let responseFilter = (req) => {
    req.on('response', (res) => {
        if (res.status === 400) {
            if (res.body.code === 10002) { // 登录过期
                if (window.location.pathname === '/') {
                    Common.goToLogin('进入到了首页，自动跳转到登录页');
                } else {
                    window.location.href = '/sessions/new?next=' + encodeURIComponent(window.location.pathname);
                }
            } else if (res.body.code === 20010) { // 商户越界
                Common.goToLogin('商户越界');
            } else if (res.body.code === 20016) { // 门店越界
                Common.goToLogin('门店越界');
            }
        }
    });

    // req.on('request', () => {
    //    console.log(req);
    // });

    // 设置超时
    req.timeout(timeOutValue);

    // req.on('abort', () => {
    //     errTip('网络错误,请刷新页面重试');
    // });

    // req.on('end', () => {
    //    console.log('我是end');
    //    req.timeout(Number.MAX_SAFE_INTEGER);
    //    //req.abort(123);
    // })
};

const errTip = (errTip = '网络错误,请刷新页面重试') => {
    const errTipContent = document.getElementById('err-tip-network');
    if(errTipContent) {//如果已经存在
        errTipContent.innerText = errTip;
        errTipContent.style.display = 'block';
        return;
    }

    const htmlContent = document.getElementsByTagName('body');
    const frameWorkContent = document.getElementById('framework');
    let errDiv = document.createElement('div');
    errDiv.id = 'err-tip-network';
    errDiv.style.position = 'absolute';
    errDiv.style.width = '200px';
    errDiv.style.height = '40px';
    errDiv.style.zIndex = 10;
    errDiv.style.top = '50%';
    errDiv.style.left = '50%';
    errDiv.style.marginTop = '-20px';
    errDiv.style.marginLeft = '-100px';
    errDiv.style.backgroundColor = 'black';
    errDiv.innerText = errTip;
    errDiv.style.color = '#fff';
    errDiv.style.lineHeight = '40px';
    errDiv.style.textAlign = 'center';
    errDiv.style.fontSize = '14px';
    errDiv.style.borderRadius = '2px';

    htmlContent[0].insertBefore(errDiv, frameWorkContent);

    //setTimeout(() => {
    //    errDiv.style.display = 'none';
    //}, 2000);
};

exports.post = (url, notUseMchId) => {
    if(notUseMchId) {
        return superagent
            .post(url)
            .use(responseFilter)
            .timeout(timeOutValue)
            .set('X-Xsrftoken', cookies.getCookie('_xsrf'));
    }else {
        return superagent
            .post('/api/m/' + mchId + url)
            .use(responseFilter)
            .timeout(timeOutValue)
            .set('X-Xsrftoken', cookies.getCookie('_xsrf'));
    }
};

exports.get = (url, notUseMchId) => {
    if(notUseMchId) {
        return superagent
            .get(url)
            .timeout(timeOutValue)
            .set('X-Xsrftoken', cookies.getCookie('_xsrf'))
            .use(responseFilter);
    }else {
        return superagent
            .get('/api/m/' + mchId + url)
            .timeout(timeOutValue)
            .set('X-Xsrftoken', cookies.getCookie('_xsrf'))
            .use(responseFilter);
    }
};

exports.put = (url, notUseMchId) => {
    if(notUseMchId) {
        return superagent
            .put(url)
            .timeout(timeOutValue)
            .use(responseFilter)
            .set('X-Xsrftoken', cookies.getCookie('_xsrf'));
    }else {
        return superagent
            .put('/api/m/' + mchId + url)
            .timeout(timeOutValue)
            .use(responseFilter)
            .set('X-Xsrftoken', cookies.getCookie('_xsrf'));
    }
};

exports.del = (url, notUseMchId) => {
    if(notUseMchId) {
        return superagent
            .del(url)
            .timeout(timeOutValue)
            .use(responseFilter)
            .set('X-Xsrftoken', cookies.getCookie('_xsrf'));
    }else {
        return superagent
            .del('/api/m/' + mchId + url)
            .timeout(timeOutValue)
            .use(responseFilter)
            .set('X-Xsrftoken', cookies.getCookie('_xsrf'));
    }
};
