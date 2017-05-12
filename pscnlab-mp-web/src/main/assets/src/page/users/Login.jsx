import './style.css';
import React from 'react';
import request from '../../common/request/request.jsx';
import storage from '../../framework/common/storage.js';
import Common from '../../common/common.jsx';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            userPassword: '',
            tipContent: '',
            isInvite: false,
            isShowErrorParamTip: false,
            loading: false,
            historyData: [],
            isShowHistory: false, // 是否显示历史记录
            isLegalQiMo: false, // 是否是七陌对接
            verifyQiMo: '//api.7moor.com/sso/token/checkTokenLegal/',
        };
    }

    componentWillMount() {
        let that = this;
        const urlId = Common.getQueryString('id');
        const urlType = Common.getQueryString('type');
        const urlKey = Common.getQueryString('key');
        const token = Common.getQueryString('token');
        const tokenId = Common.getQueryString('tokenId');

        if (token && tokenId) {
            request
                .get(`${this.state.verifyQiMo}${Common.getQueryString('token')}/${Common.getQueryString('tokenId')}`)
                .end((err, res) => {
                    if (err || !res.ok) {
                        // 七陌token错误
                    } else {
                        this.setState({
                            isLegalQiMo: true,
                        }, () => {
                            request
                                .post('/api/users/info.json', true) // 验证当前是否登录
                                .end((err, resUserInfo) => {
                                    if (err || !resUserInfo.ok) {
                                        // 当前为未登录
                                    } else {
                                        this.dealJump(resUserInfo);
                                    }
                                });
                        });
                    }
                });
        }

        if (urlType === 'invite') {
            let sendData = {
                id: urlId,
                key: urlKey,
            };

            sessionStorage.setItem('isInvite', 'invite');
            sessionStorage.setItem('inviteId', urlId);
            sessionStorage.setItem('inviteKey', urlKey);

            request
                .post('/api/invite/inviteInfo.json', true) // 验证邀请信息
                .send(sendData)
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    if (err || !res.ok) {
                        if (res.body.code === 2015) { // 处理邀请已过期
                            setTimeout(() => {
                                window.location = location.pathname;
                            }, 1000);
                        }
                    } else if (res.body.result) {
                        if (!res.body.result.hasAccount) {
                            sessionStorage.setItem('inviteEmail', res.body.result.accountName);
                            sessionStorage.setItem('inviteName', res.body.result.name);
                            window.location.href = '/users/new';
                        } else {
                            that.setState({
                                userName: res.body.result.accountName,
                                userPassword: '',
                                isInvite: true,
                            });
                        }
                    }
                });
        } else {
            let userName = this.getUserNameFromHistory();
            window.userName = userName;
            if (!userName) {
                userName = {};
            }

            userName.history = [];

            if (userName) {
                this.setState({
                    userName: userName.preAccount,
                    historyData: userName.history,
                });
            }
        }
    }

    dealJump(resUserInfo) {
        const that = this;

        if (this.state.isLegalQiMo) {
            Common.setQiMo(Common.getParams()); // 保存七陌参数到本地
        }

        request
            .get('/api/message/container/configure.json', true) // 获取任务提醒配置信息
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end((err, res) => {
                if (err || !res.ok) {
                    that.setState({
                        tipContent: res.body.message,
                    });
                } else {
                    storage.session.set('config', res.body.result);
                    that.addUserNameToHistory(this.state.userName); // 处理历史登录信息
                    storage.session.set('userInfo', resUserInfo.body.result);
                    let next = Common.getQueryString('next');
                    if (next && next !== '/') {
                        let urlArray = next.split('/');
                        let currentMerChantId = (urlArray[2]);
                        if (isNaN(currentMerChantId)) {
                            window.location = location.pathname;
                        }

                        request
                            .get(`/api/m/${currentMerChantId}/menus.json`, true)
                            .end((errMenus, resMenus) => {
                                if (errMenus || !resMenus.ok) {
                                    that.setState({
                                        tipContent: res.body.message,
                                    });
                                } else {
                                    let userMenu = resMenus.body.results;

                                    if (Common.isHaveCurrentMenu(next, resMenus.body.results)) {
                                        Common.menu.set(userMenu);

                                        // 获取品牌信息 TODO等接口
                                        request
                                            .get(`/api/merchants/${currentMerChantId}/detail.json`, true) // 获取品牌列表信息
                                            .set('Content-Type', 'application/x-www-form-urlencoded')
                                            .end((err, res) => {
                                                if (err || !res.ok) {
                                                    that.setState({
                                                        tipContent: res.body.message,
                                                    });
                                                } else {
                                                    const currentMerchantDetail = res.body.result;

                                                    storage.session.set('merchant', currentMerchantDetail);

                                                    location.href = (location.origin + decodeURI(next));
                                                }
                                            });
                                    } else {
                                        location.href = '/merchants';
                                    }
                                }
                            });
                    } else if (this.state.isLegalQiMo) {
                        if (Common.getQueryString('token')) {
                            request
                                .get('/api/merchants.json', true)
                                .end((err, res) => {
                                    if (err || !res.ok) {
                                        this.setState({
                                            tipContent: '读取品牌列表错误',
                                        });
                                    } else {
                                        const merchantData = res.body.results;
                                        if (merchantData && merchantData.length) {
                                            let currentMerChantId = merchantData[0].id;
                                            next = `/m/${currentMerChantId}/order_seat`;
                                            console.log(next, 99999888);

                                            request
                                                .get(`/api/m/${currentMerChantId}/menus.json`, true)
                                                .end((errMenus, resMenus) => {
                                                    if (errMenus || !resMenus.ok) {
                                                        that.setState({
                                                            tipContent: res.body.message,
                                                        });
                                                    } else {
                                                        let userMenu = resMenus.body.results;

                                                        if (Common.isHaveCurrentMenu(next, resMenus.body.results)) {
                                                            Common.menu.set(userMenu);

                                                            // 获取品牌信息 TODO等接口
                                                            request
                                                                .get(`/api/merchants/${currentMerChantId}/detail.json`, true) // 获取品牌列表信息
                                                                .set('Content-Type', 'application/x-www-form-urlencoded')
                                                                .end((err, res) => {
                                                                    if (err || !res.ok) {
                                                                        that.setState({
                                                                            tipContent: res.body.message,
                                                                        });
                                                                    } else {
                                                                        const currentMerchantDetail = res.body.result;

                                                                        storage.session.set('merchant', currentMerchantDetail);

                                                                        location.href = decodeURI(next);
                                                                    }
                                                                });
                                                        } else {
                                                            location.href = '/merchants';
                                                        }
                                                    }
                                                });

                                        } else {
                                            location.href = '/merchants';
                                        }
                                    }
                                });
                        }

                    } else {
                        storage.session.set('userInfo', resUserInfo.body.result);
                        if (that.state.isInvite) {
                            location.href = '/users/add';
                        } else {
                            location.href = '/merchants';
                        }
                    }
                }

                that.setState({
                    loading: false,
                });
            });
    }

    changeUserName(e) { // 用户名改变
        this.setState({
            userName: e.target.value,
            tipContent: '',
        });
    }

    changePassword(e) { // 密码改变
        if (e.target.value.length > 18) { // 密码长于18位
            return;
        }
        this.setState({
            userPassword: e.target.value,
            tipContent: '',
        });
    }

    arrayIncludes(array, vlaue) {
        array = array.filter((arrayValue) => {
            return arrayValue === vlaue;
        });
        return array.length.length;
    }

    addUserNameToHistory(userName) { // 历史登录信息
        let historyAccount = storage.local.get('historyAccount');
        if (!historyAccount) {
            historyAccount = {};
            historyAccount.history = [];
        }

        historyAccount.preAccount = userName;

        if (Object.prototype.toString.call(historyAccount.history) !== '[object Array]') {
            historyAccount.history = [];
        }

        if (!this.arrayIncludes(historyAccount.history, userName)) {
            // if(!historyAccount.history.includes(userName)) {
            historyAccount.history.push(userName);
        }

        storage.local.set('historyAccount', historyAccount);
    }

    getUserNameFromHistory() { // 获取历史登录信息
        return storage.local.get('historyAccount');
    }

    login() { // 登录
        const userName = this.state.userName;
        const password = this.state.userPassword;

        if (!userName) {
            return this.setState({
                tipContent: Common.messageContent.accountIsNull,
            });
        }

        if (!Common.formatValidation.email(userName) && !Common.formatValidation.mobile(userName)) {
            this.setState({
                tipContent: Common.messageContent.accountIsInVisible,
            });
            return;
        }

        if (!password) {
            this.setState({
                tipContent: Common.messageContent.passwordIsNull,
            });
            return;
        }

        let that = this;
        this.setState({
            loading: true,
        });
        const sendData = {
            accountName: userName,
            password,
        };
        request
            .post('/api/sessions.json', true) // 登录
            .send(sendData)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end((err, resUserInfo) => {
                if (err || !resUserInfo.ok) {
                    that.setState({
                        tipContent: resUserInfo.body.message,
                        loading: false,
                    });
                } else {
                    this.dealJump(resUserInfo);
                }
            });
    }

    getHeaderMenuPath(menu, path) {
        if (path === undefined) {
            path = '';
        }

        if (menu.children && menu.children.length > 0) {
            return this.getHeaderMenuPath(menu.children[0], path);
        } else {
            return `${path}/${menu.menuUrl}`;
        }
    }

    keyDownLogin(event) {
        if (event.keyCode === 13) {
            this.login();
        }
    }

    handleErrorParamOk() {
        this.setState({
            isShowErrorParamTip: false,
        });
    }

    handleErrorParamCancel() {
        window.location = location.pathname;
    }

    userNameInputClick() {
        if (this.state.isInvite) {
            this.setState({
                tipContent: '被邀请时,不能修改用户名',
            });
        }
    }

    userNameFocus() {
        this.setState({
            isShowHistory: true,
        });
    }

    userNameBlur() {
        const that = this;
        setTimeout(() => {
            that.setState({
                isShowHistory: false,
            });
        }, 200);
    }

    fillUserName(userName) {
        this.setState({
            userName,
        });
    }

    render() {
        const noop = false;
        const historyData = this.state.historyData.map((value, index) => {
            return <p key={index} title={value} onClick={() => this.fillUserName(value)}>{value}</p>;
        });

        return (
            <div className="full-screen-container admin-login">
                <LoginImg />
                <div className="admin-login-content">
                    <div className="admin-login-loading" style={{display: this.state.loading ? 'block' : 'none'}}>

                    </div>
                    <div className="admin-login-row admin-login-title">
                        <span className="meicanyun-logo-font admin-login-title-font">
                            {CONTEXT.MERCHANT.platformName}
                        </span>
                    </div>
                    <div className="admin-login-row admin-login-padding-left-right admin-login-subtitle">
                        <span style={{display: this.state.tipContent ? 'none' : 'block'}}>账户登录</span>
                        <div className="admin-login-error-content" style={{display: this.state.tipContent ? 'block' : 'none'}}>
                            <p>
                                {this.state.tipContent}
                            </p>
                        </div>
                    </div>
                    <div className="admin-login-row admin-login-input-content">
                        <div className="admin-login-row">
                            <label className="admin-login-name-ico" htmlFor="MCY_username"></label>
                            <input type="text" name="MCY_username" id="MCY_username" onClick={this::this.userNameInputClick} onFocus={this::this.userNameFocus} onBlur={this::this.userNameBlur} style={{disable: this.state.isInvite ? 'true' : 'false', marginBottom: 15}} maxLength="40" className="admin-login-input admin-login-name" value={this.state.userName} onKeyDown={this::this.keyDownLogin} onChange={this::this.changeUserName}
                                   disabled={this.state.isInvite} placeholder="请输入邮箱或手机号"/>
                            <div className="admin-login-fill-user-name" style={{display: (this.state.isShowHistory && this.state.historyData.length ? 'block' : 'none')}}>
                                {historyData}
                            </div>
                            <label className="admin-login-pwd-ico" htmlFor="MCY_password"></label>
                            <input type="password" name="MCY_password" id="MCY_password" maxLength="40" autoComplete="off" className="admin-login-input admin-login-pwd" onKeyDown={this::this.keyDownLogin} value={this.state.userPassword}
                                   onChange={this::this.changePassword} onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}  placeholder="请输入密码"/>
                        </div>
                    </div>
                    <div className="admin-login-row admin-login-padding-left-right admin-login-other-operate">
                        <a href="/password_find" className="pull-left admin-login-forget" title="忘记密码">忘记密码</a>
                        <a href="/users/new" className="pull-right admin-login-register" title="立即注册">立即注册</a>
                    </div>
                    <div className="admin-login-row admin-login-padding-left-right">
                        <button className="admin-login-button" onClick={this::this.login}>登录</button>
                    </div>
                </div>
                <UserFooter />
            </div>
        );
    }
}

export default Login;
