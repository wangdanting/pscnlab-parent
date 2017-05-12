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
    //
    // const taskCode = Common.taskCode.get();
    // if (Common.getStoreID.byUrl() && taskCode && taskCode.length) {
    //     /*
    //      * 显示门店右下角任务提示
    //      */
    //     request
    //         .post('/message/container/store.json')
    //         .send({storeId: Common.getStoreID.byUrl()})
    //         .set('Content-Type', 'application/x-www-form-urlencoded')
    //         .end((err, res) => {
    //             if (err || !res.ok) {
    //                 message.error(res.body.message, 1);
    //                 PubSubMsg.publish('show-global-notification', {
    //                     changeContent: (callback) => {
    //                         callback({
    //                             title: '获取任务失败',
    //                             content: '暂无任务',
    //                         });
    //                     },
    //                 });
    //                 return;
    //             }
    //             const sendData = {
    //                 level: 'store',
    //                 mchId: Common.getMerchantID.byUrl(),
    //                 storeId: Common.getStoreID.byUrl(),
    //                 taskTypes: Common.taskCode.get(),
    //             };
    //
    //             PubSubMsg.publish('show-global-notification', {
    //                 changeContent(callback) {
    //                     request
    //                         .post('/messages.json')
    //                         .send(sendData)
    //                         .set('Content-Type', 'application/json')
    //                         .end((error, response) => {
    //                             if (error || !response.ok) {
    //                                 message.error(response.body.message, 1);
    //                                 callback({
    //                                     title: '获取任务失败',
    //                                     content: '暂无任务',
    //                                 });
    //                                 return;
    //                             }
    //                             const results = response.body.results;
    //                             const taskUrl = Common.taskCode.getTaskUrl();
    //
    //                             if (results && results.length) {
    //                                 let content = [];
    //                                 let title = [];
    //                                 results.forEach((d, index) => {
    //                                     const style = {};
    //                                     const msg = JSON.parse(d.jsonMsg);
    //                                     const typeKey = d.typeKey;
    //                                     const typeName = d.typeName.replace('通知', '');
    //                                     const summary = msg.summary;
    //                                     const orderIds = msg.orderIds;
    //                                     const description = msg.description;
    //                                     // title
    //                                     if (parseInt(summary, 10) > 0 || summary === '未设置') {
    //                                         style.color = 'red';
    //                                         title.push(
    //                                             <span key={index}>
    //                                                 {typeName}(<span style={style}>{summary}</span>)
    //                                             </span>
    //                                         );
    //                                     }
    //                                     // 门店 已退款
    //                                     if (typeKey === 'order_refund_store') {
    //                                         content.push(<div key={index}>
    //                                             <Link to={taskUrl[typeKey]}
    //                                                   onClick={() => setTimeout(() => PubSubMsg.publish('store-order-search-refunding', orderIds), 0)}>
    //                                                 <span
    //                                                     style={{
    //                                                         display: 'inline-block',
    //                                                         width: 100,
    //                                                         paddingRight: 8,
    //                                                         textAlign: 'right'
    //                                                     }}
    //                                                 >
    //                                                     {typeName}：
    //                                                 </span>
    //                                                 <span style={style}>{description}</span>
    //                                             </Link>
    //                                         </div>);
    //                                     } else if (typeKey === 'order_status_changed' && /\/m\/\d+\/s\/\d+\/need_accept$/.test(location.pathname)) {
    //                                         // 当前页面是新订单页面，直接刷新数据
    //                                         if (parseInt(summary, 10) > 0) {
    //                                             PubSubMsg.publish('store-new-order-search');
    //                                         }
    //                                         // 当前页面是新订单页面，点击通过发布订阅查询数据。
    //                                         content.push(<div key={index}>
    //                                             <Link
    //                                                 to={taskUrl[typeKey]}
    //                                                 onClick={() => setTimeout(() => PubSubMsg.publish('store-new-order-search'), 0)}
    //                                             >
    //                                                 <span style={{
    //                                                     display: 'inline-block',
    //                                                     width: 100,
    //                                                     paddingRight: 8,
    //                                                     textAlign: 'right'
    //                                                 }}>{typeName}：</span>
    //                                                 <span style={style}>{description}</span>
    //                                             </Link>
    //                                         </div>);
    //                                     } else {
    //                                         content.push(<div key={index}>
    //                                             <Link to={taskUrl[typeKey]}>
    //                                                 <span style={{
    //                                                     display: 'inline-block',
    //                                                     width: 100,
    //                                                     paddingRight: 8,
    //                                                     textAlign: 'right'
    //                                                 }}>{typeName}：</span>
    //                                                 <span style={style}>{description}</span>
    //                                             </Link>
    //                                         </div>);
    //                                     }
    //
    //                                     // 门店 待入厨订单语音提示
    //                                     if (typeKey === 'order_status_changed' && summary !== '0') {
    //                                         PubSubMsg.publish('tipAudio');
    //                                     }
    //                                     // 门店 已退款语音提示
    //                                     if (typeKey === 'order_refund_store' && summary !== '0') {
    //                                         PubSubMsg.publish('tipAudio', 'refund');
    //                                     }
    //                                 });
    //                                 callback({
    //                                     title: title.length ? title : '无任务提醒',
    //                                     content,
    //                                 });
    //                             } else {
    //                                 callback({
    //                                     title: '无任务提醒',
    //                                     content: '暂无任务',
    //                                 });
    //                             }
    //                         });
    //                 },
    //             });
    //
    //         });
    // } else if (
    //     (location.pathname === `/m/${Common.getMerchantID.byUrl()}/search_order` ||
    //     location.pathname === `/m/${Common.getMerchantID.byUrl()}/examine_refund`)
    //     && taskCode && taskCode.length
    // ) {
    //     /*
    //      * 显示品牌右下角提示
    //      */
    //     request
    //         .post('/message/container/merchant.json')
    //         .set('Content-Type', 'application/json')
    //         .end((err, res) => {
    //             console.log(err);
    //             if (err || !res.ok) {
    //                 message.error(res.body.message, 1);
    //                 PubSubMsg.publish('show-global-notification', {
    //                     changeContent: (callback) => {
    //                         callback({
    //                             title: '获取任务失败',
    //                             content: '暂无任务',
    //                         });
    //                     },
    //                 });
    //                 return;
    //             }
    //             const sendData = {
    //                 level: 'mch',
    //                 mchId: Common.getMerchantID.byUrl(),
    //                 taskTypes: Common.taskCode.get(),
    //             };
    //             PubSubMsg.publish('show-global-notification', {
    //                 changeContent: (callback) => {
    //                     request
    //                         .post('/messages.json')
    //                         .send(sendData)
    //                         .set('Content-Type', 'application/json')
    //                         .end((error, response) => {
    //                             if (error || !response.ok) {
    //                                 message.error(response.body && response.body.message || '获取任务失败', 1);
    //                                 callback({
    //                                     title: '获取任务失败',
    //                                     content: '暂无任务',
    //                                 });
    //                                 return;
    //                             }
    //                             const results = response.body.results;
    //                             const taskUrl = Common.taskCode.getTaskUrl();
    //                             if (results && results.length) {
    //                                 let content = [];
    //                                 let title = [];
    //                                 results.forEach((d, index) => {
    //                                     const msg = JSON.parse(d.jsonMsg);
    //                                     const typeName = d.typeName.replace('通知', '');
    //                                     const typeKey = d.typeKey;
    //                                     const orderIds = msg.orderIds;
    //                                     const summary = msg.summary;
    //                                     const description = msg.description;
    //                                     const style = {};
    //                                     if (parseInt(summary, 10) > 0 || summary === '未设置') {
    //                                         style.color = 'red';
    //                                         title.push(
    //                                             <span key={index}>
    //                                                 {typeName}(<span style={style}>{summary}</span>)
    //                                             </span>
    //                                         );
    //                                     }
    //                                     if (typeKey === 'order_refund_mch') {
    //                                         content.push(<div key={index}>
    //                                             <Link to={`${taskUrl[typeKey]}`}
    //                                                   onClick={() => setTimeout(() => PubSubMsg.publish('order-search-refunding', orderIds), 0)}>
    //                                                 <span
    //                                                     style={{
    //                                                         display: 'inline-block',
    //                                                         width: 100,
    //                                                         paddingRight: 8,
    //                                                         textAlign: 'right'
    //                                                     }}
    //                                                 >
    //                                                     {typeName}：
    //                                                 </span>
    //                                                 <span style={style}>{description}</span>
    //                                             </Link>
    //                                         </div>);
    //                                     } else {
    //                                         content.push(<div key={index}>
    //                                             <Link to={taskUrl[typeKey]}>
    //                                                 <span
    //                                                     style={{
    //                                                         display: 'inline-block',
    //                                                         width: 100,
    //                                                         paddingRight: 8,
    //                                                         textAlign: 'right'
    //                                                     }}
    //                                                 >
    //                                                     {typeName}：
    //                                                 </span>
    //                                                 <span style={style}>{description}</span>
    //                                             </Link>
    //                                         </div>);
    //                                     }
    //
    //                                     // 品牌 已退款语音提示
    //                                     if (typeKey === 'order_refund_mch' && summary !== '0') {
    //                                         PubSubMsg.publish('tipAudio', 'refund');
    //                                     }
    //                                     // 品牌 待审核语音提示
    //                                     if (typeKey === 'order_refund_review' && summary !== '0') {
    //                                         PubSubMsg.publish('tipAudio', 'refund-review');
    //                                     }
    //                                 });
    //                                 callback({
    //                                     title: title.length ? title : '无任务提醒',
    //                                     content,
    //                                 });
    //                             } else {
    //                                 callback({
    //                                     title: '无任务提醒',
    //                                     content: '暂无任务',
    //                                 });
    //                             }
    //                         });
    //                 },
    //             });
    //         });
    // } else {
    //     PubSubMsg.publish('hide-global-notification');
    // }
});

export default React.createClass({
    render() {
        return (
            <Router routes={routes} history={browserHistory}/>
        );
    }
});
