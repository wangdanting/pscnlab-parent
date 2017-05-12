import './style.less';
import React from 'react';
import { Menu } from 'antd';
import PubSubMsg from '../common/pubsubmsg';
import Settings from '../settings/Settings';
import Common from '../../common/common.jsx';

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
        // console.log('click menu', e);
        /*
         * 点击Link会改变地址栏，地址栏改变会同步菜单状态，这里就不用再改变菜单状态了，重复了。
         * 这里改变状态会导致没有点击到Link，但是点击到了菜单，菜单状态会改变，但是页面并没有跳转的bug。
         * */
        // this.setState({
        //    current: e.key,
        //    openKeys: e.keyPath.slice(1) // 点击是会关闭其他菜单,如果不需要改变其他菜单状态,注释掉这里即可.
        // });
    };

    onToggle = (info) => {
        if (this.state.collapseSidebar) return; // 折叠状态时,不改变打开菜单状态,否则切回展开状态,无法恢复打开状态.
        this.setState({
            openKeys: info.openKeys,
        });
    };
    getSidebarImage = () => {
        const isStore = Common.currentPosition.isStore();
        if (isStore) {
            // 获取门店图片
            const currentStore = Common.getStoreID.byUrl();
            const stores = Common.getStores() || [];
            const currentStoreInfo = stores.filter((store) => {
                return parseInt(store.id) === parseInt(currentStore);
            });

            return `${(currentStoreInfo[0]).storeLogoUrl}?x-oss-process=image/resize,h_70`;
        }
        return Common.getMerchant().logo;
    };

    componentWillMount() {
        if (Common.getStoreID.byUrl() != null) {
            this.setState({
                currentPosition: Common.getCurrentStore().name,
            });
        }

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
                            src={this.getSidebarImage()}
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
