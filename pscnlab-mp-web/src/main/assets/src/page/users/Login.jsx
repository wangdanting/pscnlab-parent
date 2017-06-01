import './style.less';
import 'component/logo-font/style.css';
import React from 'react';
import request from '../../common/request/request.jsx';
import storage from '../../framework/common/storage.js';
import Common from '../../common/common.jsx';

import LoginImg from './LoginImg';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            userPassword: '',
            tipContent: '',
            isShowErrorParamTip: false,
            loading: false,
            historyData: [],
            isShowHistory: false, // 是否显示历史记录
        };
    }

    componentWillMount() {
        let that = this;

        //获取登录信息
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

    // 用户名改变
    changeUserName(e) {
        this.setState({
            userName: e.target.value,
            tipContent: '',
        });
    }

    // 密码改变
    changePassword(e) {
        if (e.target.value.length > 18) { // 密码长于18位
            return;
        }
        this.setState({
            userPassword: e.target.value,
            tipContent: '',
        });
    }

    // 获取历史登录信息
    getUserNameFromHistory() {
        return storage.local.get('historyAccount');
    }

    // 登录
    login() {
        const userName = this.state.userName;
        const password = this.state.userPassword;

        if (!userName) {
            return this.setState({
                tipContent: Common.messageContent.accountIsNull,
            });
        }

        if (!Common.formatValidation.mobile(userName)) {
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
            telephone: userName,
            password,
        };
        request
            .post('/login.json', true) // 登录
            .send(sendData)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end((err, resUserInfo) => {
                if (err || !resUserInfo.ok) {
                    console.log(resUserInfo, 'resUserInfo');
                    that.setState({
                        tipContent: resUserInfo.body.message,
                        loading: false,
                    });
                } else {
                    console.log('成功了');
                    console.log(resUserInfo, 'resUserInfo');
                    that.setState({
                        loading: false,
                    });
                    if(resUserInfo.text) {
                        let MemberInfo = JSON.parse(resUserInfo.text);
                        storage.session.set('MemberInfo', MemberInfo);
                        let uuid = MemberInfo.uuidMember;
                        location.href = `${uuid}/role`;
                    }
                }
            });
    }

    keyDownLogin(event) {
        if (event.keyCode === 13) {
            this.login();
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
                            人格与社会认知神经科学实验室
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
                            <input type="text" name="MCY_username" id="MCY_username" onFocus={this::this.userNameFocus} onBlur={this::this.userNameBlur} style={{marginBottom: 15}} maxLength="40" className="admin-login-input admin-login-name" value={this.state.userName} onKeyDown={this::this.keyDownLogin} onChange={this::this.changeUserName}
                                   placeholder="请输入手机号"/>
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
                        <a href="/users/new" className="pull-right admin-login-register" title="立即注册">修改密码</a>
                    </div>
                    <div className="admin-login-row admin-login-padding-left-right">
                        <button className="admin-login-button" onClick={this::this.login}>登录</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
