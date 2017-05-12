import './style.less';
import '../../component/logo-font/style.css';
import React from 'react';
import { Menu, Popconfirm, message } from 'antd';
import ClassNames from 'classnames';
import { Link } from 'react-router';
import IconFont from '../../component/icon-font/IconFont';
import PubSubMsg from '../common/pubsubmsg';
import {getSidebarMenus, getCurrentSidebarMenu} from '../SidebarMenu';
import Settings from '../settings/Settings';
import request from '../../common/request/request.jsx';
import storage from '../../framework/common/storage.js';
import Common from '../../common/common.jsx';
import UserDefaultImage from '../../page/system/user-default-image/UserDefaultImage.jsx';
import StoresList from './StoresList';

const logoMaxWidth = 200;
const logoMinWidth = 60;

class Header extends React.Component {
    state = {
        menu: [],
        current: '',
        collapseSidebar: Settings.collapseSidebar(),
        userInfo: {},
    };

    handleSwitchMenu = () => {
        Settings.collapseSidebar(!Settings.collapseSidebar());
        let menu = getSidebarMenus();
        let currentSidebarMenu = getCurrentSidebarMenu();
        let current = currentSidebarMenu ? currentSidebarMenu.key : '';

        PubSubMsg.publish('switch-sidebar', Settings.collapseSidebar());
        PubSubMsg.publish('sidebar-menu', {
            menu,
            current,
        });

        this.setState({
            collapseSidebar: Settings.collapseSidebar(),
        });
    };

    componentDidMount() {
        PubSubMsg.subscribeAcceptOldMsg('header-menu', (data) => {
            this.setState({
                menu: data.menu,
                current: data.current,
            });

            const userInfo = storage.session.get('userInfo');
            if (!userInfo) {
                Common.goToLogin('用户信息不存在');
            }

            this.setState({
                userInfo,
            });
        });
    }

    handleSignOutPopVisibleChange = (visible) => {
        if (visible) {
            window.setTimeout(() => {
                $('.ant-popover.ant-popover-placement-bottomRight')
                    .css('top', '54px')
                    .css('position', 'fixed');
            });
        }
    };

    signOut() { // 退出登录
        request
            .del('/api/sessions.json', true)
            .end((err, res) => {
                if (err || !res.ok) {
                    message.error(res.body.message, 1);
                } else {
                    // TODO 处理登录的历史账户,重构后修改
                    const historyAccount = localStorage.getItem('historyAccount');
                    storage.session.removeAll();
                    localStorage.setItem('historyAccount', historyAccount);

                    Common.goToLogin('退出登录');
                }
            });
    }

    render() {
        const adminLogoMaxClass = ClassNames({
            'admin-logo': true,
            'meicanyun-logo-font': true,
            hide: this.state.collapseSidebar,
        });

        const adminLogoMinClass = ClassNames({
            'admin-logo': true,
            'meicanyun-logo-font': true,
            'admin-logo-min': true,
            hide: !this.state.collapseSidebar,
        });

        return (
            <header className="admin-header">
                <div className={adminLogoMaxClass} title={CONTEXT.MERCHANT.platformName}>
                    {CONTEXT.MERCHANT.platformName}
                </div>
                <div className={adminLogoMinClass} title={CONTEXT.MERCHANT.platformName}>
                    <p>{CONTEXT.MERCHANT.platformName.slice(0, 3)}</p>
                    <p>{CONTEXT.MERCHANT.platformName.slice(3)}</p>
                </div>
                <div className="admin-nav" style={{left: this.state.collapseSidebar ? logoMinWidth : logoMaxWidth}}>
                    <a className="admin-sidebar-toggle" onClick={this.handleSwitchMenu}><IconFont type="qiehuancaidanzhuangtai"/></a>
                    <Menu
                        className="admin-header-sys"
                        selectedKeys={[this.state.current]}
                        mode="horizontal">
                        {this.state.menu}
                    </Menu>

                    <ul className="admin-header-menu">
                        <li className="admin-header-menu-item">
                            <Link to={`/m/${Common.getMerchantID.byUrl()}/system/profile/password`} style={{height: '48px'}}>
                                <UserDefaultImage imageUrl={this.state.userInfo.avatar}/>
                                <span>{this.state.userInfo.userName}</span>
                            </Link>
                        </li>
                        <li className="admin-header-menu-item">
                            <a href="/merchants">
                                <IconFont type="qiehuanshanghu"/>
                                切换品牌
                            </a>
                        </li>
                        <li className="admin-header-menu-item">
                            <Popconfirm
                                onVisibleChange={this.handleSignOutPopVisibleChange}
                                placement="bottomRight"
                                title="您确定要退出系统吗？"
                                onConfirm={this.signOut}
                            >
                                <a href="###">
                                    <IconFont type="tuichu"/>
                                    退出系统
                                </a>
                            </Popconfirm>
                        </li>
                    </ul>
                    <StoresList/>
                </div>
            </header>
        );
    }
}

export default Header;
