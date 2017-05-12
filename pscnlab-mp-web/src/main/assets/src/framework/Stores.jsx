import storage from './common/storage.js';
import Common from '../common/common.jsx';
var merchantId = Common.getMerchantID.byUrl();
let Stores = '';

function getMenusFirstUrl(menu) {
    if(menu.children && menu.children.length > 0) {
        return getMenusFirstUrl(menu.children[0]);
    }else {
        return menu.menuUrl + (menu.menuParam ? '?' + menu.menuParam : '');
    }
}

if (!Stores) {
    let MENUS = Common.menu.get();
    for (var i = 0; i < MENUS.length; i++) {
        if(MENUS[i].menuTarget == 'list') {//处理门店的点击跳转path
            MENUS[i].children.forEach(function(value) {
                value.storePath = ('/m/' + merchantId + '/s/' + value.id + '/' + getMenusFirstUrl(value));
            });
            storage.session.set('stores', MENUS[i].children);
        }
    }
    Stores = storage.session.get('stores');
}

exports.getStoresList = () => {
    if (!Stores) {
        return [];
    } else {
        return Stores;
    }
}
