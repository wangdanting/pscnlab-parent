import React from 'react';
import IconFont from '../component/icon-font/IconFont';
import {Link} from 'react-router';
import {Menu, Icon} from 'antd';
import {getHeaderMenusData} from './menus';
import PubSubMsg from './common/pubsubmsg';
import Common from '../common/common.jsx';
import storage from 'framework/common/storage.js';
import request from '../common/request/request.jsx';

let headerMenuData = getHeaderMenusData();

/**
 * 根据地址栏url 获取 头部菜单对应的key
 * @param isSystemMenu
 * @returns {*}
 */
function getCurrentKey(isSystemMenu) {
    if (isSystemMenu) {
        return '';
    }
    if (Common.currentPosition.isStore()) {
        return 'store';
    }
    if (Common.currentPosition.isMerchant()) {
        return 'mch';
    }
    return '';
}

function handleMouseEnter() {
    PubSubMsg.publish('storesMouseEnter');
}

function handleMouseLeave() {
    PubSubMsg.publish('storesMouseLeave');
}

function getMenusFirstUrl(menu) {
    if (menu.children && menu.children.length > 0) {
        return getMenusFirstUrl(menu.children[0]);
    }
    return menu.menuUrl;
}

let getCurrentPosition = function () {
    if (Common.currentPosition.isStore()) {//表明当前选择的门店
        return Common.getCurrentStore().name;
    } else {
        return Common.getMerchant().name;
    }
};

function handleStoreClick(store) {
    //request
    //    .post('/message/container/store.json')
    //    .send({storeId: store.id})
    //    .set('Content-Type', 'application/x-www-form-urlencoded')
    //    .end((err, res) => {
    //        if (err || !res.ok) {
    //            message.error(res.body.message, 3);
    //        } else {
    //            storage.session.set('currentStore', store);
    //
    //            PubSubMsg.publish('set-current-position', getCurrentPosition());
    //        }
    //    });
}

/**
 * 创建头部菜单jsx形式数据。
 * @param menuData
 * @returns {Array}
 */
function buildHeaderMenu(menuData) {
    let menuItems = [];
    for (let i = 0; i < menuData.length; i++) {
        let md = menuData[i];
        if (md.target === 'list') {
            if (Common.getStores() && Common.getStores().length > 1) {
                menuItems.push(
                    <Menu.Item key={md.key} style={{padding: 0}}>
                        <div
                            style={{padding: '0 20px'}}
                            onMouseEnter={this::handleMouseEnter}
                            onMouseLeave={this::handleMouseLeave}
                        >
                            <IconFont type={md.icon}/>
                            <span className="admin-header-sys-menu-text">{md.text}</span>
                            <Icon type="down" style={{marginRight: 0, marginLeft: 10}}/>
                        </div>
                    </Menu.Item>
                );
            } else {
                let path = `${md.merchantPath}s/${Common.getStores()[0].id}/${getMenusFirstUrl(md)}`;
                menuItems.push(
                    <Menu.Item key={md.key}>
                        <a href={path} onClick={handleStoreClick(Common.getStores()[0], path)}>
                            <IconFont type={md.icon}/>
                            <span className="admin-header-sys-menu-text">{md.text}</span>
                        </a>
                    </Menu.Item>
                );
            }
        } else {
            menuItems.push(
                <Menu.Item key={md.key}>
                    <Link to={md.path}>
                        <IconFont type={md.icon}/>
                        <span className="admin-header-sys-menu-text">{md.text}</span>
                    </Link>
                </Menu.Item>
            );
        }
    }
    return menuItems;
}

/**
 * 获取头部菜单构建完成的jsx数据,直接可以用于显示
 * @param isSystemMenu
 * @returns {*[]}
 */
function getHeaderMenus(isSystemMenu) {
    let headerMenuCurrent = getCurrentKey(isSystemMenu);
    let headerMenu = buildHeaderMenu(headerMenuData);
    return [headerMenu, headerMenuCurrent];
}

/**
 * 获取头部需要设为当前状态的菜单数据.
 * @returns {*}
 */
function getCurrentHeaderMenu() {
    let headerMenuCurrent = getCurrentKey();
    for (let i = 0; i < headerMenuData.length; i++) {
        if (headerMenuCurrent === headerMenuData[i].key) {
            return headerMenuData[i];
        }
    }
    return null;
}

export {getHeaderMenus, getCurrentHeaderMenu};
