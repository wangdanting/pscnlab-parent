import React from 'react';
import { Router, Link } from 'react-router';
import { message} from 'antd';
import App from './app/App';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import PubSubMsg from './common/pubsubmsg';
import {getSidebarMenus, getCurrentSidebarMenu, getCurrentPosition} from './SidebarMenu';
import {getHeaderMenus} from './HeaderMenu';
import pageRouts from '../page/AllRoutes';
import storage from '../framework/common/storage.js';
import Common from '../common/common.jsx';
import PushMessage from './PushMessage';

let browserHistory = createBrowserHistory();
let merchantId = Common.getMerchantID.byUrl();
let mchId = `/m/${merchantId}`;
/*
 * 根据菜单数据，初始化路由
 * */
let routes = {
    path: '/',
    component: App,
    indexRoute: {
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../page/system/home/Home'));
            });
        },
    },
    childRoutes: pageRouts,
};
/*
 * 所有未截获的请求,统一跳转到Error404组件
 * */
routes.childRoutes.push(
    {
        path: `${mchId}/system/settings`, isSystemMenu: true, getComponent: (location, cb) => {
        require.ensure([], (require) => {
            cb(null, require('./settings/SettingsPage'));
        });
    },
    },
    {
        path: '*', getComponent: (location, cb) => {
        require.ensure([], (require) => {
            cb(null, require('./error/Error404'));
        });
    },
    }
);

let prePosition = '';
const dealPushMessage = () => {
    const currentIsStore = Common.currentPosition.isStore();
    const currentIsMerchant = Common.currentPosition.isMerchant();

    if (!prePosition) { // 如果是第一次进入
        const taskCode = Common.taskCode.get();
        try {
            if (Common.currentPosition.isStore()) {
                PushMessage.openEventbus(() => {
                    PushMessage.push.store.register.storeTask();
                    PushMessage.push.store.register.orderStatusChanged();
                    PushMessage.push.store.register.pullTask();

                    // 第一次进入去拉去消息
                    setTimeout(() => {
                        PushMessage.push.store.send.pullTask();
                    }, 200);
                });
            } else if ((location.pathname === `/m/${Common.getMerchantID.byUrl()}/search_order` ||
                location.pathname === `/m/${Common.getMerchantID.byUrl()}/examine_refund`) && taskCode && taskCode.length) {
                PushMessage.openEventbus(() => {
                    PushMessage.push.merchant.register.merchantTask();
                    PushMessage.push.merchant.register.pullTask();

                    // 第一次进入去拉去消息
                    setTimeout(() => {
                        PushMessage.push.merchant.send.pullTask();
                    }, 200);
                });
            }
        } catch (e) {
            console.log(e);
            return message.error('拉取数据错误', 2);
        }
    } else if (!currentIsStore && currentIsMerchant) {
        if (prePosition === 'store') { // 如果是从门店切换过来，则先隐藏任务提示框
            PubSubMsg.publish('hide-global-notification');
        }

        const taskCode = Common.taskCode.get();
        if ((location.pathname === `/m/${Common.getMerchantID.byUrl()}/search_order` ||
            location.pathname === `/m/${Common.getMerchantID.byUrl()}/examine_refund`) && taskCode && taskCode.length) {
            PushMessage.openEventbus(() => {
                PushMessage.push.merchant.register.merchantTask();
                PushMessage.push.merchant.register.pullTask();

                // 第一次进入去拉去消息
                setTimeout(() => {
                    PushMessage.push.merchant.send.pullTask();
                }, 200);
            });
        } else {
            PubSubMsg.publish('hide-global-notification');
        }
    }

    prePosition = (currentIsStore ? 'store' : (currentIsMerchant ? 'merchant' : ''));
};

/*
 * 监听地址栏改变，通过左侧菜单状态
 * */
browserHistory.listen((data) => {
    if (Common.currentPosition.isStore()) {
        const currentStoreId = Common.getStoreID.byUrl();
        const currentStore = Common.getStores().filter(store => parseInt(store.id, 10) === parseInt(currentStoreId, 10));

        storage.session.set('currentStore', currentStore[0]);
        PubSubMsg.publish('set-current-position', currentStore[0].name);
    }

    let isHaveMenu = true;
    let isHaveShowDetail = true;
    let currentMenu = '';
    pageRouts.forEach(value => {
        const routePath = value.path;
        if (!routePath) {
            return false;
        }

        const routeArray = routePath.split('/');
        const locationArray = location.pathname.split('/');
        if (locationArray[locationArray.length - 1].indexOf('c_reports_r') < 0 && /\d/gi.test(locationArray[locationArray.length - 1])) {
            //if (location.pathname.includes(routeArray.slice(0, routeArray.length - 1).join('/') + '/')) {
            currentMenu = value;

            if (value.haveShowDetail) {
                if (routePath === locationArray.slice(0, locationArray.length - 1).join('/')) {
                    data.pathname = locationArray.slice(0, locationArray.length - 1).join('/');
                }
            } else {
                if (location.pathname.indexOf(routeArray.slice(0, routeArray.length - 1).join('/') + '/') >= 0) {
                    if (value.noHaveMenu) {
                        isHaveMenu = false;
                        return false;
                    }
                }
            }
        } else {
            if (location.pathname === routePath) {
                currentMenu = value;

                if (value.noHaveMenu) {
                    isHaveMenu = false;
                    return false;
                }
            }
        }
    });

    /*
     * 处理是否刷新左侧和顶部菜单
     */
    if (!isHaveMenu) {//如果是在数据库中没有的菜单
        data = Common.proUrl.get();
        PubSubMsg.publish('set-header-breadcrumb', currentMenu.isSystemMenu);
        let [headerMenu, headerMenuCurrent] = getHeaderMenus(currentMenu.isSystemMenu);
        PubSubMsg.publish('header-menu', {
            menu: headerMenu,
            current: headerMenuCurrent
        });
        let menu = getSidebarMenus(currentMenu.isSystemMenu);

        let currentSidebarMenu = getCurrentSidebarMenu(data, currentMenu.isSystemMenu);
        let current = currentSidebarMenu ? currentSidebarMenu.key : '';
        let openKeys = currentSidebarMenu ? currentSidebarMenu.openKeys : [];
        let currentPosition = getCurrentPosition();
        PubSubMsg.publish('sidebar-menu', {
            menu,
            current,
            openKeys
        });
        PubSubMsg.publish('set-header-breadcrumb', currentMenu.isSystemMenu)

        /*
         * 设置当前位置(商户名或门店名)
         */
        PubSubMsg.publish('set-current-position', currentPosition);

    } else {
        let [headerMenu, headerMenuCurrent] = getHeaderMenus(currentMenu.isSystemMenu);
        PubSubMsg.publish('header-menu', {
            menu: headerMenu,
            current: headerMenuCurrent
        });
        let menu = getSidebarMenus(currentMenu.isSystemMenu);
        let currentSidebarMenu = getCurrentSidebarMenu('', currentMenu.isSystemMenu);
        let current = currentSidebarMenu ? currentSidebarMenu.key : '';
        let openKeys = currentSidebarMenu ? currentSidebarMenu.openKeys : [];
        let currentPosition = getCurrentPosition();
        PubSubMsg.publish('sidebar-menu', {
            menu,
            current,
            openKeys
        });

        PubSubMsg.publish('set-header-breadcrumb', currentMenu.isSystemMenu)

        /*
         * 设置当前位置(商户名或门店名)
         */
        PubSubMsg.publish('set-current-position', currentPosition);

        Common.proUrl.set(data);
    }

    dealPushMessage();
});

export default React.createClass({
    render() {
        return (
            <Router routes={routes} history={browserHistory}/>
        );
    }
});
