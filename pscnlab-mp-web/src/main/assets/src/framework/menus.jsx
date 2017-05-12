import Common from '../common/common.jsx';
import storage from './common/storage.js';
var MENUS = Common.menu.get();
var merchantId = Common.getMerchantID.byUrl();

function getMenusFirstUrl(menu) {
    if(menu.children && menu.children.length > 0) {
        return getMenusFirstUrl(menu.children[0]);
    }else {
        return menu.menuUrl + (menu.menuParam ? '?' + menu.menuParam : '');
    }
}

export function getHeaderMenusData() {
    var headerMenus = [];
    for (var i = 0; i < MENUS.length; i++) {
        var oriHm = MENUS[i];
        var path = getHeaderMenuPath(oriHm);
        headerMenus.push({
            'key': oriHm.menuKey,
            'text': oriHm.menuName,
            'target': oriHm.menuTarget,
            'children': oriHm.children,
            'icon': oriHm.menuPic || 'fa-windows',
            'merchantPath': '/m/'+ merchantId +'/',
            'path': '/m/'+ merchantId + path
        });
        if(MENUS[i].menuTarget == 'list') {//处理门店的点击跳转path
            MENUS[i].children.forEach(function(value) {
                value.storePath = ('/m/' + merchantId + '/s/' + value.id + '/' + getMenusFirstUrl(value));
            });
            storage.session.set('stores', MENUS[i].children);
        }
    }
    return headerMenus
}
export function getSidebarMenusData() {
    var sideBarMenus = {};
    for (var i = 0; i < MENUS.length; i++) {
        var oriHm = MENUS[i];
        if(oriHm.menuTarget === 'list') {
            let storeSideBarMenus = {};
            oriHm.children.forEach(function(value) {
                value.children.forEach(childrenValue => {
                    childrenValue.target = value.target;
                    childrenValue.merchantPath = value.merchantPath;
                });
                //storeSideBarMenus[value.id] = getSidebarMenusChildren(value.children,undefined,'/s/' + value.id + '/' +oriHm.menuKey);
                storeSideBarMenus[value.id] = getSidebarMenusChildren(value.children,undefined,'/s/' + value.id + '');
            });
            sideBarMenus[oriHm.menuKey] = storeSideBarMenus;
        }else {
            //sideBarMenus[oriHm.menuKey] = getSidebarMenusChildren(oriHm.children,undefined,'/'+oriHm.menuKey);
            sideBarMenus[oriHm.menuKey] = getSidebarMenusChildren(oriHm.children,undefined,'');
        }
    }
    return sideBarMenus;
}

function getSidebarMenusChildren(children, menus, parentPath) {
    if (menus === undefined) menus = [];
    if (parentPath === undefined) parentPath = '/';
    if (children && children.length > 0) {
        for (var i = 0; i < children.length; i++) {
            if(children[i].path) {
                children[i] = children[i].children;
            }
            var m = children[i];
            var mm = {
                'key': m.id,
                'text': m.menuName,
                'icon': m.menuPic || 'fa-arrow-right',
                'path': m.menuUrl ? m.menuUrl : '',
                'children': null,
                'target': m.target,
                'merchantPath': m.merchantPath,
                'taskCode': m.taskCode,
                'menuParam': m.menuParam

            };
            if (m.children && m.children.length > 0) {
                mm.icon = m.menuPic || 'fa-th-list';
                mm.children = getSidebarMenusChildren(m.children, [], parentPath);
            } else {
                if(mm.path){
                    mm.path = '/m/'+ merchantId +'' +parentPath+'/'+mm.path + (m.menuParam ? '?' + m.menuParam : '');
                }
                mm.children = null;
            }
            menus.push(mm);
        }

    }
    return menus;
}
function getHeaderMenuPath(menu, path) {
    if (path == undefined) path = '';
    if (menu.children && menu.children.length > 0) {
        return getHeaderMenuPath(menu.children[0], path);
    } else {
        return path + '/' + menu.menuUrl + (menu.menuParam ? '?' + menu.menuParam : '');
    }
}

