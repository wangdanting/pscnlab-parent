import React from 'react';
import {message} from 'antd';
import PubSubMsg from '../common/pubsubmsg';
import Common from '../../common/common.jsx';
import Stores from '../Stores';
import storage from '../common/storage.js';
import request from '../../common/request/request.jsx';

let getMenusFirstUrl = (menu, path = '') => {
    if (menu.children && menu.children.length > 0) {
        return getMenusFirstUrl(menu.children[0], path);
    }
    const params = menu.menuParam ? `?${menu.menuParam}` : '';
    return `${path}/${menu.menuUrl + params}`;
};

class StoresList extends React.Component {
    state = {
        isUponSotresLink: false,
        isShowStoresList: false,
        isUponStoresList: false,
        isEnterHeaderStore: false, // 是否离开顶部的门店菜单
        isLeaveHeaderStore: false, // 是否离开顶部的门店菜单
        storesList: [],
        currentStore: {},
        isSelectStore: false, // 是否选择门店loading
    };

    componentWillMount() {
        PubSubMsg.subscribe('storesMouseEnter', () => {
            setTimeout(() => {
                this.setState({
                    isEnterHeaderStore: true,
                    isLeaveHeaderStore: false,
                });
                if (!this.state.isLeaveHeaderStore) { // 增加延迟,避免鼠标滑过显示门店列表
                    this.setState({
                        isShowStoresList: true,
                        isUponSotresLink: true,
                    });
                }
            }, 200);
        });

        PubSubMsg.subscribe('storesMouseLeave', () => {
            this.setState({
                isUponSotresLink: false,
                isEnterHeaderStore: false,
                isLeaveHeaderStore: true,
            });
            setTimeout(() => {
                if (!this.state.isUponStoresList) {
                    this.setState({
                        isShowStoresList: false,
                    });
                }
            }, 200);
        });

        PubSubMsg.subscribe('updateCurrentStoresList', (mchIdAndStoresId) => {
            let [mchId] = mchIdAndStoresId;
            request
                .get(`/api/m/${mchId}/menus.json`, true)
                .end((err, res) => {
                    if (err || !res.ok) {
                        message.error('读取菜单错误,请重试', 1);
                        return false;
                    }
                    let userMenu = res.body.results;
                    Common.menu.set(userMenu);
                    if (userMenu && userMenu.length) {
                        this.setState({
                            storesList: [],
                        });

                        userMenu.forEach((value) => {
                            if (value.menuTarget === 'list') {
                                Common.setStores(value.children);

                                value.children.forEach((itemValue) => {
                                    itemValue.storePath = (`/m/${Common.getMerchantID.byUrl()}/s/${itemValue.id}${getMenusFirstUrl(itemValue)}`);
                                });
                                storage.session.set('stores', value.children);
                                this.setState({
                                    storesList: value.children,
                                });
                            }
                        });
                    } else {
                        // 未获取到菜单，直接跳转首页
                        Common.goToLogin('门店列表中，没获取到菜单');
                    }
                });
        });

        const storesList = Stores.getStoresList();
        this.setState({
            storesList,
        });

        if (Common.currentPosition.isStore()) {
            this.setState({
                currentStore: Common.getCurrentStore(),
            });
        }
    }

    handleMouseEnter = () => {
        this.setState({
            isUponStoresList: true,
        });
    };

    handleMouseLeave = () => {
        this.setState({
            isUponStoresList: false,
        });

        if (!this.state.isSelectStore) {
            setTimeout(() => {
                if (!this.state.isUponSotresLink) {
                    this.setState({
                        isShowStoresList: false,
                    });
                }
            }, 200);
        }
    };

    handleStoresListClick = (store) => {
        this.setState({
            isSelectStore: true,
        });

        request
            .post('/message/container/store.json')
            .send({storeId: store.id})
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end((err, res) => {
                if (err || !res.ok) {
                    message.error(res.body.message, 1);
                } else {
                    storage.session.set('currentStore', store);
                    Common.storeSetting.set(store.isAutoAccept || false);
                    window.location.href = store.storePath;
                }
                this.setState({
                    isSelectStore: false,
                });
            });
    };

    render() {
        const storesList = this.state.storesList.map(store =>
            <div style={{display: 'inline-block'}} key={store.name} onClick={() => this.handleStoresListClick(store)}>
                <div
                    className={this.state.currentStore.id === store.id ? 'stores-list-item active' : 'stores-list-item'}>
                    <img
                        src={`${store.storeLogoUrl}?x-oss-process=image/resize,m_fixed,h_53,w_53`}
                        style={{width: 53, height: 53, borderRadius: 4, float: 'left', border: 'none'}}
                        onError={(e) => { e.target.src = Common.getPlatform.logo('default', 53, 53); e.target.error = null; }}
                        title="logo"
                        alt="logo"
                    />
                    <div
                        style={{lineHeight: '18px', fontWeight: 'bold', overflow: 'hidden', height: 53}}
                    >
                        <span style={{textAlign: 'center', width: 95, float: 'left'}}>{store.name}</span>
                    </div>
                </div>
            </div>
        );
        return (
            <div
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                className="stores-list-container"
                style={{height: this.state.isShowStoresList ? 226 : 0}}
            >
                <div
                    className="admin-login-loading"
                    style={{display: this.state.isSelectStore ? 'block' : 'none'}}
                ></div>
                {storesList}
            </div>
        );
    }
}

export default StoresList;
