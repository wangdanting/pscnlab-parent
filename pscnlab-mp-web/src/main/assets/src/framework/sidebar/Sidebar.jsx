import './style.less';
import React from 'react';
import { Menu, Icon } from 'antd';
import PubSubMsg from '../common/pubsubmsg';
import Settings from '../settings/Settings';
import Common from '../../common/common.jsx';
const SubMenu = Menu.SubMenu;

import touxiang from './touxiang.jpg';

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            menu: [],
            current: '',
            openKeys: [],
            maxWidth: 200,
            minWidth: 60,
            collapseSidebar: Settings.collapseSidebar(),
            scrollBarWidth: 15,
            currentPosition: '',
        };
    }

    handleClick = () => {

    };

    onToggle = (info) => {
        if (this.state.collapseSidebar) return; // 折叠状态时,不改变打开菜单状态,否则切回展开状态,无法恢复打开状态.
        this.setState({
            openKeys: info.openKeys,
        });
    };
    // getSidebarImage = () => {
    //     const isStore = Common.currentPosition.isStore();
    //     if (isStore) {
    //         // 获取门店图片
    //         const currentStore = Common.getStoreID.byUrl();
    //         const stores = Common.getStores() || [];
    //         const currentStoreInfo = stores.filter((store) => {
    //             return parseInt(store.id) === parseInt(currentStore);
    //         });
    //
    //         return `${(currentStoreInfo[0]).storeLogoUrl}?x-oss-process=image/resize,h_70`;
    //     }
    //     return Common.getMerchant().logo;
    // };

    componentWillMount() {
        // if (Common.getStoreID.byUrl() != null) {
        //     this.setState({
        //         currentPosition: Common.getCurrentStore().name,
        //     });
        // }

        PubSubMsg.subscribeAcceptOldMsg('sidebar-menu', (data) => {
            if (data.menu && data.menu.length > 0) {
                this.setState({
                    hidden: false,
                    menu: data.menu,
                    current: data.current,
                    openKeys: data.openKeys || this.state.openKeys,
                });
            } else {
                this.setState({
                    hidden: true,
                });
            }
        });

        // console.log(sidebarData.menu, 'sidebarData.menu');
        // if (sidebarData.menu && sidebarData.menu.length > 0) {
        //     this.setState({
        //         hidden: false,
        //         menu: sidebarData.menu,
        //         current: sidebarData.current,
        //         openKeys: sidebarData.openKeys || this.state.openKeys,
        //     });
        // } else {
        //     this.setState({
        //         hidden: true,
        //     });
        // }

        PubSubMsg.subscribeAcceptOldMsg('switch-sidebar', (data) => {
            this.setState({
                collapseSidebar: data,
            });
        });

        PubSubMsg.subscribeAcceptOldMsg('set-current-position', (data) => {
            this.setState({
                currentPosition: data,
            });
        });

        this.setState({
            scrollBarWidth: Common.getScrollBarWidth(),
        });
    }

    render() {
        const sidebarWidth = this.state.collapseSidebar ? this.state.minWidth : this.state.maxWidth;
        const sidebarOverflow = this.state.collapseSidebar ? 'visible' : 'hidden';
        let sidebarStyle = {
            width: this.state.hidden ? 0 : sidebarWidth,
            overflow: this.state.hidden ? 'hidden' : sidebarOverflow,
        };

        let sidebarInnerStyle = {
            width: this.state.collapseSidebar ? this.state.minWidth : this.state.maxWidth + this.state.scrollBarWidth,
            overflowY: this.state.collapseSidebar ? 'visible' : 'scroll',
        };
        return (
            <div className="admin-sidebar" style={sidebarStyle}>
                <div className="admin-sidebar-inner" style={sidebarInnerStyle}>
                    <div className={this.state.collapseSidebar ? 'sidebar-current-position min' : 'sidebar-current-position'}>
                        <img
                            src={touxiang}
                            onError={(e) => { e.target.src = Common.getPlatform.logo('default', 80, 80); e.target.error = null; }}
                            title=""
                            alt=""
                        />
                        <div className="title" title={this.state.currentPosition}>{this.state.currentPosition}</div>
                    </div>
                    <Menu
                        openKeys={this.state.openKeys}
                        selectedKeys={[this.state.current]}
                        onClick={this.handleClick}
                        onOpen={this.onToggle}
                        onClose={this.onToggle}
                        mode={this.state.collapseSidebar ? 'vertical' : 'inline'}>
                        {this.state.menu}
                    </Menu>

                </div>
            </div>
        );
    }
}
