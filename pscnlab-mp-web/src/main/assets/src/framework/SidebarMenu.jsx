import React from "react";
import IconFont from '../component/icon-font/IconFont';
import {Link} from "react-router";
import {Menu, Tooltip, message} from "antd";
import Settings from "./settings/Settings";
import {getSidebarMenusData} from "./menus";
import Common from "../common/common.jsx";
const SubMenu = Menu.SubMenu;

let merchantId = Common.getMerchantID.bySessionStorage();//获取商户id,如果为空已处理

let taskCodeList = [];

/*
 * 获取左侧菜单jsx数据,可以用于直接显示.
 * */
export let getSidebarMenus = function (isSystemMenu) {
    let [minSidebarMenu, maxSidebarMenu] = getMenusData(isSystemMenu);
    let min = Settings.collapseSidebar() ? true : false;
    minSidebarMenu = minSidebarMenu || [];
    maxSidebarMenu = maxSidebarMenu || [];
    return min ? minSidebarMenu : maxSidebarMenu;
};
/*
 * 获取要设为当前状态的菜单数据.
 * */
export let getCurrentSidebarMenu = function (data, isSystemMenu) {
    let [, , simpleMenuData] = getMenusData(isSystemMenu);
    if (!simpleMenuData) {
        return null;
    }
    let openAll = Settings.sidebarMenuAlwaysOpen();
    let openKeys = [];
    let currentMenu = null;
    for (let i = 0; i < simpleMenuData.length; i++) {
        let menu = simpleMenuData[i];
        if (menu.path) {
            menu.path = menu.path.split('?')[0];//处理url的参数
        }
        if (openAll && menu.parentKeys) {
            openKeys.push(...menu.parentKeys);
        }

        if (data) {
            let dataPathName = data.pathname.split('?')[0];
            //if (location.pathname == menu.path || location.pathname.startsWith(menu.path)) {
            if (dataPathName == menu.path || dataPathName.match('^' + menu.path)) {
                let m = simpleMenuData[i];
                if (!openAll) {
                    openKeys = m.parentKeys;
                }
                currentMenu = m;
                currentMenu.openKeys = openKeys;
                if (dataPathName == menu.path) {
                    //如果精确匹配，直接跳出循环。
                    break;
                }
            }
        } else {
            let currentPathName = location.pathname.split('?')[0];
            //if (location.pathname == menu.path || location.pathname.startsWith(menu.path)) {
            if (menu.path && (currentPathName == menu.path || currentPathName.match('^' + menu.path))) {
                let m = simpleMenuData[i];
                if (!openAll) {
                    openKeys = m.parentKeys;
                }
                currentMenu = m;
                currentMenu.openKeys = openKeys;
                if (currentPathName == menu.path) {
                    //如果精确匹配，直接跳出循环。
                    break;
                }
            }
        }
    }

    if (currentMenu) {//openKeys去重
        currentMenu.openKeys = arrayUnique(openKeys)
    }
    return currentMenu;
};
/*
 * 获取当前位置
 */
export let getCurrentPosition = function () {
    if (Common.currentPosition.isStore()) {//表明当前选择的门店
        return Common.getCurrentStore().name;
    } else {
        return Common.getMerchant().name;
    }
};
/*
 * 对象键值法(该方法性能最优)
 * @method 定义一个空对象和空新数组，遍历当前的数组，判断该对象是否存在数组的某一项，如果不存在
 * 就当当前的某一项存入新数组去，且当前的项置为-1 目的过滤掉重复的项
 */
function arrayUnique(arrs) {
    var newArrays = [];
    var hash = {};
    if (arrs.length > 0) {
        for (var i = 0, ilen = arrs.length; i < ilen; i += 1) {
            if (!hash[arrs[i]]) {
                hash[arrs[i]] = 1;
                newArrays.push(arrs[i]);
            }
        }
    }
    return newArrays;
}

/*
 * //通过菜单获取任务编码
 */
function getTaskCodeFromMenu(menu) {
    for (let i = 0, menuLength = menu.length; i < menuLength; i++) {
        if (menu[i].children && menu[i].children.length > 0) {
            getTaskCodeFromMenu(menu[i].children);
        } else {
            if (menu[i].taskCode) {
                let taskCodeArray = menu[i].taskCode.split(',');
                taskCodeArray.forEach((value) => {
                    taskCodeList.push({code: value, url: menu[i].path});
                });
            }
        }
    }
}

/*
 * 获取菜单数据,数据来源可以是服务器,可以在这里硬编码
 * return:
 *   minSidebarMenu: 收缩时菜单数据 jsx
 *   maxSidebarMenu: 展开时菜单数据 jsx
 *   simpleMenuData: 菜单数据扁平化结构,非树状结构. js
 *
 * */
function getMenusData(isSystemMenu) {

    /*
     * 根据 headerMenuCurrent，获取对应的左侧菜单。
     *
     * */
    let sidebarMenuData = getSidebarMenusData();
    sidebarMenuData['system'] = [
        /*{
         text: '我的邮件', icon: 'fa-envelope-o',
         children: [
         {text: '未读邮件', icon: 'fa-arrow-right', path: '/m/1/system/mail/unread'},
         {text: '已读邮件', icon: 'fa-arrow-right', path: '/m/1/system/mail/read'}
         ]
         },
         {text: '我的提醒', icon: 'fa-bell-o', path: '/m/1/system/remind'},
         */
        //{text: '系统设置', icon: 'fa-cogs', path: '/m/' + merchantId + '/system/settings'},
        {
            text: '个人设置', icon: 'fa-user',
            children: [
                //{text: '修改个人信息', icon: 'fa-arrow-right', path: '/m/' + merchantId + '/system/profile/message', isSystemMenu: true},
                {text: '修改密码', icon: 'fa-arrow-right', path: '/m/' + merchantId + '/system/profile/password', isSystemMenu: true}
            ]
        }
    ];
    let pathNames = location.pathname.split('/');
    let headerMenuCurrent = null;
    if (pathNames && pathNames.length > 0) {
        if (Common.currentPosition.isStore()) {
            //headerMenuCurrent = pathNames[5];// url为：/m/1/s/1/xx
            headerMenuCurrent = 'store';// url为：/m/1/s/1/xx
        } else {
            //headerMenuCurrent = pathNames[3];// url为：/m/1/xxx
            headerMenuCurrent = 'mch';// url为：/m/1/xxx
        }
    }

    let menuData = [];
    if (isSystemMenu) {
        menuData = sidebarMenuData['system'];
    } else {
        menuData = sidebarMenuData[headerMenuCurrent];
    }

    const locationArray = location.pathname.split('/');
    if (Common.currentPosition.isStore()) {
        //let menuDataList = [];
        //menuData.forEach(function(value) {
        //    if(value.hasOwnProperty('path')) {
        //        menuDataList.push(value.children);
        //    }else {
        //        menuDataList.push(value);
        //    }
        //})
        //console.log(menuDataList);
        //menuData = menuDataList;
        menuData = menuData[Common.getStoreID.byUrl()];

        if (!menuData || menuData.length <= 0) {//如果没有菜单
            message.error('当前门店已下线或者你没有该门店的权限!', 2);
            setTimeout(() => {
                Common.goToLogin('当前门店已下线或者你没有该门店的权限');
            }, 2000);
            return;
        }
    }
    taskCodeList = [];
    getTaskCodeFromMenu(menuData);
    Common.taskCode.set(taskCodeList);
    let [minSidebarMenu] = buildSidebarMenu(menuData, true, location.pathname);
    let [maxSidebarMenu, simpleMenuData] = buildSidebarMenu(menuData, false, location.pathname);
    return [minSidebarMenu, maxSidebarMenu, simpleMenuData]
}
/*
 * 基于树状结构的菜单数据,构造出对应jsx数据一级扁平化数据
 * return:
 *   sidebarMenu: 收缩/展开时菜单数据 jsx
 *   simpleMenuData: 菜单数据扁平化结构,非树状结构. js
 *
 * */
function buildSidebarMenu(menuData, min) {
    /*
     * 菜单是否全部展开
     * */
    let simpleMenuData = [];
    if (!menuData) {
        return [];
    }
    function covertMenuFromData(menuData, min, parent) {
        parent = parent || {
                key: '0',
                parentKeys: [],//地址栏改变时，用于同步左侧菜单状态
                parentText: [],//当page的header为auto时，用来设置头部的面包屑导航。
                subMenus: []
            };
        for (let i = 0; i < menuData.length; i++) {
            var menu = menuData[i];
            simpleMenuData.push(menu);
            menu.key = parent.key + '-' + i;
            menu.parentKeys = [...parent.parentKeys, parent.key];
            menu.parentText = parent.text ? [...parent.parentText, parent.text] : [...parent.parentText];
            if (menu.children) {
                menu.subMenus = [];
                let text = min && parent.key === '0' ? '' : menu.text;
                parent.subMenus.push(
                    <SubMenu key={menu.key} title={<span><IconFont type={menu.icon} />{text}</span>}>
                        {menu.subMenus}
                    </SubMenu>
                );
                covertMenuFromData(menu.children, min, menu);
            } else {
                if (min && parent.key === '0') {
                    parent.subMenus.push(
                        <Menu.Item key={menu.key}>
                            <Tooltip placement="right"
                                     title={<Link to={menu.path} activeClassName="active" style={{color: '#fff'}}>{menu.text}</Link>}>
                                <Link to={menu.path} activeClassName="active">{menu.text[0]}
                                </Link>
                            </Tooltip>
                        </Menu.Item>
                    );
                } else {
                    parent.subMenus.push(
                        <Menu.Item key={menu.key}>
                            <Link to={menu.path} activeClassName="active">{menu.text}</Link>
                        </Menu.Item>
                    );
                }
            }
        }
        return [parent.subMenus, simpleMenuData];
    }

    return covertMenuFromData(menuData, min);

}
