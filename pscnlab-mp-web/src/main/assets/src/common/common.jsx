import React from 'react';
import storage from '../framework/common/storage.js';

// 过滤特殊字符
const FILTER_PATTERN = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]");
// 特殊字符正则
const SPECIAL_WORD_REG = /[`~!@#$%￥^&*()_+<>?:"{},.\/;'[\]～！＠＃￥％……＆×（）——＋_｛｝【】：“‘’”；，。、｜－\＝《》？]/im;
// 邮箱正则
const EMAIL_REG = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// 手机正则
const MOBILE_REG = /^1[35789]\d{9}$/;
// 座机号正则
const TELEPHONE_REG = /(^(\d{2,4}[-_－—]?)?\d{3,8}([-_－—]?\d{3,8})?([-_－—]?\d{1,7})?$)|(^0?1[35]\d{9}$)/;
// 银行卡号正则
const BANK_REG = /^[0-9]{15,20}$/;
// 商户url正则
const MERCHANT_URL_REG = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+\/m\/\d{1,}\//;
// 门店url正则
const STORE_URL_REG = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+\/m\/\d{1,}\/s\/\d{1,}\//;

/*
 * 处理文本位多行显示,中间默认以空格隔开
 * 例如 2015-01-01 10:10:10
 * 处理为 2015-01-01
 *       10:10:10
 */
exports.operateWrap = (dealStr, separator) => {
    if (dealStr) {
        let strList = separator ? dealStr.split(separator) : dealStr.split(' ');

        if (strList.length <= 1) {
            return dealStr;
        }

        return strList.map((item) => {
            return (
                <p key={item} style={{wordWrap: 'break-word'}}>
                    {item}
                </p>
            );
        });
    }

    return <span></span>;
};

/*
 特殊字符正则
 */
exports.specialWordReg = SPECIAL_WORD_REG;

/*
 过滤特殊字符
 */
exports.filterText = (dealStr) => {
    return dealStr.split('').map(value => value.replace(FILTER_PATTERN, '')).join('');
};

/*
 提示内容,整理一套错误的提示
 */
exports.messageContent = {
    storeIsNull: '门店不能为空',
    dateIsNull: '日期不能为空',
    loadFilterDataError: '读取查询条件错误',
    operateOrderIsNull: '请选择需要操作的订单',
    operateSuccess: '操作成功',
    printOrderIsNull: '请选择需要打印的订单',
    refundReasonIsNull: '请选择退款原因',
    userIsNull: '用户名不能为空',
    passwordIsNull: '密码不能为空',
    emailIsInVisible: '请输入正确的邮箱',
    phoneIsInVisible: '请输入正确的手机号',
    accountIsInVisible: '请输入正确的邮箱或手机号',
    accountIsNull: '账号不能为空',
    loginSuccess: '登录成功',
    emailIsNull: '邮箱不能为空',
    oldPasswordIsNull: '旧密码不能为空',
    newPasswordIsNull: '新密码不能为空',
    deliveryPushError: '请重试,如果继续失败,请走闪送',
    bankNumberIsError: '请输入正确的银行卡账号',
};

/*
 格式验证
 */
exports.formatValidation = {
    email: (value) => {
        if (!value) {
            return false;
        }

        return EMAIL_REG.exec(value);
    },
    mobile: (value) => {
        if (!value) {
            return false;
        }

        return MOBILE_REG.exec(value);
    },
    telephone: (value) => {
        if (!value) {
            return false;
        }

        return TELEPHONE_REG.exec(value);
    },
    bank: (value = '') => {
        if (!value.trim()) {
            return false;
        }
        return BANK_REG.exec(value.trim());
    },
};

/**
 * 跳转到登录页面，并记录信息到localStorage
 * @param message
 */
const goToLogin = exports.goToLogin = (message) => {
    const outMessage = {
        message,
        href: location.href,
    };

    storage.local.set('goToLoginMessage', outMessage);
};

/*
 * 获取商户id
 * 1.通过url获取,2.通过sessionstorge获取
 */
let getCurrentMerchantID = exports.getMerchantID = {
    byUrl: () => {
        let currentUrl = window.location.href;
        let matchStr = currentUrl.match(new RegExp(MERCHANT_URL_REG));
        if (matchStr && matchStr.length > 0) {
            let matchArrary = matchStr[0].split('/');
            return matchArrary[matchArrary.length - 2];
        }

        goToLogin('获取商户id为空');
    },
    bySessionStorage: () => {
        const merchant = storage.session.get('merchant');
        if (!merchant) {
            goToLogin('获取商户id时，商户为空');
        }

        let merchantId = merchant.id;
        if (merchantId) {
            return merchantId;
        }

        goToLogin('获取门店id为空');
    },
};

exports.getMerchant = () => {
    let merchant = storage.session.get('MemberInfo');
    console.log(merchant, 'merchant444');
    if (!merchant) {
        goToLogin('获取成员为空');
    }
    return merchant;
};

/*
 * 获取门店id
 *   1.通过url获取,2.通过sessionstorge获取
 */
let getStoreID = {
    byUrl: (currentUrl = window.location.href) => {
        let matchStr = currentUrl.match(new RegExp(STORE_URL_REG));
        if (matchStr && matchStr.length > 0) {
            let matchArrary = matchStr[0].split('/');
            return matchArrary[matchArrary.length - 2];
        }

        return null;
    },
    bySessionStorage: () => {
        let storeId = storage.session.get('currentStore');
        if (!storeId) {
            let storeIdFromStoresList = storage.session.get('stores');
            if (storeIdFromStoresList && storeIdFromStoresList.length) {
                return storeIdFromStoresList[0].id;
            }

            return 1001;
        }

        return storeId.id;
    },
};
exports.getStoreID = getStoreID;

exports.getStores = () => {
    return storage.session.get('stores');
};

exports.setStores = (value) => {
    storage.session.set('stores', value);
    return true;
};

exports.getCurrentStore = () => {
    let store = storage.session.get('currentStore');
    if (!store) {
        let stores = storage.session.get('stores');
        return stores[0];
    }
    return store;
};

exports.setCurrentStore = (value) => {
    storage.session.set('currentStore', value);
    return true;
};

/*
 * 获取url中的参数,
 *   ?id=XXX,用法getQueryString('id')
 */
exports.getQueryString = (name) => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    const regStr = window.location.search.substr(1).match(reg);
    if (regStr) {
        return unescape(regStr[2]);
    }
    return null;
};

/*
 * 获取系统配置
 */
exports.systemSetting = {
    set: () => {

    },
    get: () => {
        return storage.session.get('config');
    },
};

/*
 * 门店配置
 */
exports.storeSetting = {
    set: (value) => {
        storage.session.set('storeConfig', value);
        return true;
    },
    get: () => {
        return storage.session.get('storeConfig');
    },
};

exports.getNotificationSetting = () => {
    let config = storage.session.get('config');
    if (config) {
        return config;
    }

    console.log('读取配置文件出错!');
};

/*
 *  关于taskCode的一些操作
 */
exports.taskCode = {
    set: (value) => {
        let taskCode = [];
        let taskUrl = {};
        value.forEach((taskItem) => {
            if (taskCode.join(',').indexOf(taskItem.code) < 0) {
                taskCode.push(taskItem.code);
            }
            if (!taskUrl[taskItem.code]) {
                taskUrl[taskItem.code] = taskItem.url;
            }
        });
        storage.session.set('taskCode', taskCode);
        storage.session.set('taskUrl', taskUrl);
        return true;
    },
    get: () => {
        let taskCode = storage.session.get('taskCode');
        return taskCode || [];
    },
    getTaskUrl: () => {
        let taskUrl = storage.session.get('taskUrl');
        return taskUrl || [];
    },
};

/*
 * 关于消息通知本地化
 */
exports.notification = {
    addNotification: (value) => {
        let notification = storage.session.get('notification');
        if (!notification) {
            notification = {};
        }

        value.forEach((valueItem) => {
            notification[valueItem.typeKey] = valueItem;
        });
        storage.session.set('notification', notification);
    },
    deleteNotification: () => {

    },
    getNotification: () => {
        let notification = storage.session.get('notification');
        return notification || {};
    },
    getCurrentShow: () => {
        let notificationIsShow = storage.session.get('notificationIsShow');
        if (notificationIsShow === undefined || notificationIsShow === null) {
            return false;
        }

        return notificationIsShow;
    },
    setCurrentShow(value) {
        storage.session.set('notificationIsShow', value);
    },
};

/*
 * 关于上一个url,用于处理数据库中没有的url刷新导致的bug
 */
exports.proUrl = {
    set: (value) => {
        storage.session.set('proUrl', value);
        return true;
    },
    get: () => {
        let proURL = storage.session.get('proUrl');
        return proURL;
    },
};

/*
 * 判断当前是门店还是商户
 */
let currentPosition = {
    isStore: (currentUrl = window.location.href) => {
        let matchStr = currentUrl.match(new RegExp(STORE_URL_REG));
        return matchStr && matchStr.length > 0;
    },
    isMerchant: (currentUrl = window.location.href) => {
        let matchStr = currentUrl.match(new RegExp(MERCHANT_URL_REG));
        return matchStr && matchStr.length > 0;
    },
};
exports.currentPosition = currentPosition;

/*
 * 获取当前用户信息
 */
exports.getCurrentUser = () => {
    return storage.session.get('MemberInfo');
};

/*
 * 获取不同尺寸商户logo
 */
let getMerchantLogoBySize = (platform, width = 200, height = 200) => {
    let returnData = '';
    switch (platform) {
        case 'baidu':
            returnData = `//i2.xygcdn.com/common/baidulogo.jpg@${width}w_${height}h_2e`;
            break;
        case 'eleme':
            returnData = `//i2.xygcdn.com/common/eleme-min.jpg@${width}w_${height}h_2e`;
            break;
        case 'meituan':
            returnData = `http://i.jbgcdn.com/common/meituan-logo.jpg@${width}w_${height}h_2e`;
            break;
        case 'self':
            let merchant = storage.session.get('merchant');

            if (!merchant) {
                goToLogin('获取商户logo时，商户为空');
            }
            let merchantLogo = merchant.logo;

            if (merchantLogo) {
                let merchantLogoMax = merchantLogo.split('@')[0];
                returnData = `${merchantLogoMax}@${width}w_${height}h_2e`;
            }
            break;
        default:
            returnData = `//i2.xygcdn.com/common/quesheng.min.jpg@${width}w_${height}h_2e`;
    }
    return returnData;
};
exports.getMerchantLogoBySize = getMerchantLogoBySize;
/*
 * 设置用户信息
 */
exports.setCurrentUser = (value) => {
    storage.session.set('userInfo', value);
    return true;
};


let getCurrentMenu = {
    byApi: () => {
        return [];
    },
    bySessionStorage: () => {
        let currentMenu = storage.session.get('userMenu');
        return currentMenu || [];
    },
};

let returnIsContainMenuUrl = false;
let isContainMenuUrl = (menuKey, menu) => {
    menu.forEach((menuChildren) => {
        if (menuChildren.children && menuChildren.children.length) {
            isContainMenuUrl(menuKey, menuChildren.children);
        } else {
            if (menuChildren.menuUrl === menuKey) {
                returnIsContainMenuUrl = true;
            }
        }
    });
};

exports.isHaveCurrentMenu = (url, menu) => {
    if (!url) {
        return false;
    }

    const regexStr = /\/m\/\d{1,}\/s\/\d{1,}\//;
    let matchStr = url.match(new RegExp(regexStr));

    let urlKey = '';
    let urlKeyArray;
    let urlKeyList = url.split('?')[0].split('/');
    if (!isNaN(urlKeyList[urlKeyList.length - 1])) { // 判断是否是详情页等:详情页的标志就是以数字结尾
        if (matchStr) { // 如果是门店
            urlKeyArray = urlKeyList.slice(5, urlKeyList.length - 1);
        } else {
            urlKeyArray = urlKeyList.slice(3, urlKeyList.length - 1);
        }
    } else {
        if (matchStr) { // 如果是门店
            urlKeyArray = urlKeyList.slice(5);
        } else {
            urlKeyArray = urlKeyList.slice(3);
        }
    }
    urlKey = urlKeyArray.join('/');

    if (!menu) {
        menu = getCurrentMenu.bySessionStorage();
        if (!menu.length) { // 表示没有菜单
            return false;
        }
    }

    if (matchStr) { // 如果url是门店
        returnIsContainMenuUrl = false;
        menu.forEach((menuInfo) => {
            if (menuInfo.menuTarget === 'list') {
                let currentStore = 0;
                if (matchStr && matchStr.length > 0) { // 获取门店id
                    let matchArrary = matchStr[0].split('/');
                    currentStore = matchArrary[matchArrary.length - 2];
                }

                menuInfo.children.forEach((storeMenuInfo) => {
                    if (storeMenuInfo.id === currentStore) {
                        isContainMenuUrl(urlKey, storeMenuInfo.children);
                    }
                });
            }
        });
        return returnIsContainMenuUrl;
    }

    // 如果是商户
    returnIsContainMenuUrl = false;
    menu.forEach((menuInfo) => {
        if (menuInfo.menuTarget !== 'list') {
            isContainMenuUrl(urlKey, menuInfo.children);
        }
    });
    return returnIsContainMenuUrl;
};

/*
 * 跳转到拥有菜单权限的第一个菜单
 */
let getHeaderMenuPath = (menu, path) => {
    if (!path) path = '';

    if (menu.children && menu.children.length > 0) {
        return getHeaderMenuPath(menu.children[0], path);
    }

    return `${path}/${menu.menuUrl}${menu.menuParam ? `?${menu.menuParam}` : ''}`;
};

exports.getFirstDefaultUrl = (merchantId = getCurrentMerchantID.byUrl(), menu) => {
    if (!menu) {
        menu = storage.session.get('userMenu');
    }

    /*
     * 获取第一个系统的第一个可用菜单。
     */
    if (menu && menu.length) {
        let firstMenu = '';
        if (menu[0].menuTarget === 'list') {
            firstMenu = `/s/${menu[0].children[0].id}`;

            storage.session.set('stores', menu[0].children);
            storage.session.set('currentStore', menu[0].children[0]);
        } else {
            // firstMenu = menu[0].menuKey;
            firstMenu = '';
        }
        let firstPath = getHeaderMenuPath(menu[0]);
        window.location.href = `/m/${merchantId}${firstMenu}${firstPath}`;
    } else {
        // 未获取到菜单，直接跳转首页
        goToLogin('判断第一个菜单时，没有任何菜单信息');
    }
};

exports.menu = {
    set: (value) => {
        storage.session.set('userMenu', value);
        return true;
    },
    get: () => {
        return storage.session.get('userMenu');
    },
};

exports.weiXinShowQrCode = () => {
    return 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=';
};

/*
 * 显示大图片
 */
let closeImageLarge = () => {
    const adminImageLarge = document.getElementById('admin-image-large');
    if (adminImageLarge) {
        adminImageLarge.style.display = 'none';
    }
};

exports.getLargeImage = (imageURL) => {
    const adminImageLarge = document.getElementById('admin-image-large');
    const adminImageLargeImg = document.getElementById('admin-image-large-img');
    if (adminImageLargeImg) { // 如果已经存在
        adminImageLargeImg.src = imageURL;
        adminImageLarge.style.display = 'block';
        return;
    }

    const frameWorkContent = document.getElementById('framework');

    let div = document.createElement('div');
    div.className = 'admin-image-large';
    div.id = 'admin-image-large';

    let img = document.createElement('img');
    img.id = 'admin-image-large-img';
    img.className = 'admin-image-large-img';
    img.src = imageURL;

    let divImgContent = document.createElement('div');
    divImgContent.className = 'admin-image-large-img-content';

    let divClose = document.createElement('div');
    divClose.className = 'admin-image-large-img-close';
    divClose.innerText = 'X';
    divClose.addEventListener('click', closeImageLarge);

    divImgContent.appendChild(divClose);
    divImgContent.appendChild(img);
    div.appendChild(divImgContent);

    frameWorkContent.appendChild(div);
};

exports.getScrollBarWidth = () => {
    let scrollDiv = document.createElement('div');
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '50px';
    scrollDiv.style.height = '50px';
    scrollDiv.style.overflow = 'scroll';
    document.body.appendChild(scrollDiv);
    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
};

exports.getPlatform = {
    name: (platform) => {
        let returnData = '';
        switch (platform) {
            case 'self':
                returnData = '自有平台';
                break;
            case 'eleme':
                returnData = '饿了么';
                break;
            case 'weixin':
                returnData = '微信';
                break;
            case 'baidu':
                returnData = '百度';
                break;
            case 'meituan':
                returnData = '美团';
                break;
            default:
                returnData = platform;
        }
        return returnData;
    },
    logo: getMerchantLogoBySize,
};

/*
 * 获取url里面所有的参数,并返回一个对象
 */
exports.getParams = (url = window.location.search.slice(1)) => {
    let returnData = {};
    url.split('&').forEach((value) => {
        const objectArray = value.split('=');
        returnData[objectArray[0]] = objectArray[1];
    });
    return returnData;
};

/*
 * 设置七陌参数到sessionStorage
 */
exports.setQiMo = (value) => {
    storage.session.set('qimo', value);
    return true;
};

/*
 * 读取七陌参数从sessionStorage
 */
exports.getQiMo = () => {
    return storage.session.get('qimo');
};

/*
 * 调用浏览器自带的打印功能，边距，页码等信息，在弹出框设置。
 */
exports.printHTML = (id) => {

    // 获取cdn地址
    let host = '';
    let links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        if (link.rel === 'icon') {
            host = link.href.split('/')[2];
            break;
        }
    }
    let targetStr = document.getElementById(id).innerHTML;

    // electron 打印
    try {
        const electron = window.require('electron');
        const {ipcRenderer, shell, remote} = electron;
        let win = null;
        win = new remote.BrowserWindow();
        win.on('close', () => { win = null; })
        win.loadURL(location.origin + '/print');

        let headStyle1 = `<link rel="stylesheet" href="http://${host}/assets/antd.min.css">`;
        let headStyle2 = `<link rel="stylesheet" href="http://${host}/assets/index.css">`;
        let headStr = headStyle1 + headStyle2;

        win.webContents.executeJavaScript(`window.document.head.innerHTML='${headStr}'`);
        win.webContents.executeJavaScript(`window.document.body.innerHTML='${targetStr}'`);

        setTimeout(() => {
            win.webContents.print({silent: false, printBackground: false});
            win.webContents.executeJavaScript('window.close();');
        }, 200);
        return;
    }
    catch (err) {}

    console.log('浏览器打印');
    // 浏览器打印
    let a = window.open();
    a.eval(`document.write('<link rel="stylesheet" href="http://${host}/assets/antd.min.css">')`);
    a.eval(`document.write('<link rel="stylesheet" href="http://${host}/assets/index.css">')`);
    a.eval(`document.write('${targetStr}')`);
    setTimeout(() => {
        a.eval('window.print();window.close();');
    }, 200);
};
exports.GET_XSRF = () => {

    if (document.cookie.length>0)
    {
        let c_start=document.cookie.indexOf("_xsrf=")
        if (c_start!=-1) {
            c_start=c_start + "_xsrf=".length;

            let c_end=document.cookie.indexOf(";",c_start);

            if (c_end==-1) c_end=document.cookie.length;

            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return null;
}
