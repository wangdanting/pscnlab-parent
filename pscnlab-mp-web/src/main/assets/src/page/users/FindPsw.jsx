import './style.less';
import React from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
const FormItem = Form.Item;
const createForm = Form.create;
import ForgetPassword from './ForgetPassword';
import request from '../../common/request/request.jsx';
import PubSubMsg from '../../framework/common/pubsubmsg';
import Common from '../../common/common.jsx';

import UserHeader from './UserHeader.jsx';
import UserBackGroundParticles from './UserBackGroundParticles.jsx';

class FindPsw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                account: {},
            },
            formData: {
                account: undefined,
            },
            isAccountOver: false, // account 是否输入完毕
            accountValidateMethod: 'onBlur', // 用于改变 account 的验证方法,
            isShowRegister: true,
            isSendAccount: false,
        };
    }

    handleAccountInputBlur() {
        this.setState({
            isAccountOver: true,
        });
    }

    handleAccountInputFocus() {
        if (this.state.isAccountOver) {
            this.setState({
                accountValidateMethod: 'onChange',
            });
        }
    }

    getValidateStatus(field) {
        const { isFieldValidating, getFieldError, getFieldValue } = this.props.form;
        if (isFieldValidating(field)) {
            return 'validating';
        } else if (!!getFieldError(field)) {
            return 'error';
        } else if (getFieldValue(field)) {
            return 'success';
        }
    }

    returnLogin() { // 返回登录
        Common.goToLogin('找回密码，返回登录');
    }

    // 校验账号
    checkAccount = (rule, value, callback) => {
        if (!Common.formatValidation.email(value) && !Common.formatValidation.mobile(value)) {
            callback([new Error(Common.messageContent.accountIsInVisible)]);
        }
        callback();
    };


    checkPass(rule, value, callback) {
        const form = this.props.form;
        const { getFieldValue } = this.props.form;

        if (form.getFieldValue('newPassword') && form.getFieldValue('reNewPassword')) {
            form.validateFields(['reNewPassword'], { force: true });
        }
        callback();
    };

    checkRePass(rule, value, callback) {
        if (value && value !== this.props.form.getFieldValue('newPassword')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    };

    submitModify(e) { // 提交新密码
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('error');
            } else {
                let that = this;
                const sendData = {
                    telephone: values.telephone,
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                };
                request
                    .post('/user/update_passwd.json', true)
                    .send(sendData)
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .end((err, res) => {
                        if (err || !res.ok) {
                            message.error(res.body.message, 2);
                        } else {
                            message.success('密码修改成功', 2);
                            location.href = `/login`;
                        }
                    });
            }
        });
    }

    render() {
        const that = this;
        const noop = false;
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const accountProps = getFieldProps('telephone', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
            initialValue: that.state.formData.account,
        });
        const oldPasswordProps = getFieldProps('oldPassword', {
            rules: [
                { required: true, whitespace: true, min: 6, max: 18, message: '请输入6~18位密码' },
                { validator: this::this.checkPass },
            ],
        });

        const newPasswordProps = getFieldProps('newPassword', {
            rules: [
                { required: true, whitespace: true, min: 6, max: 18, message: '请输入6~18位密码' },
                { validator: this::this.checkPass },
            ],
        });

        const reNewPasswordProps = getFieldProps('reNewPassword', {
            rules: [
                { required: true, whitespace: true, min: 6, max: 18, message: '请再次输入新密码' },
                { validator: this::this.checkRePass },
            ],
        });

        return (
            <div className="full-screen-container admin-forget">
                <UserHeader userHeaderTitle="修改密码"/>
                <UserBackGroundParticles />
                <Form horizontal className="admin-form-center admin-form-register-send-email" form={this.props.form} style={{display: (this.state.isShowRegister ? 'block' : 'none'), width: 400, height: 500}}>
                    <Spin spining={this.state.isSendAccount}>
                        <FormItem
                            label=""
                            labelCol={{span: 0}}
                            wrapperCol={{span: 24}}>
                            <h2 className="admin-form-center-title">填写账户</h2>
                        </FormItem>
                        <FormItem
                            labelCol={{span: 0}}
                            wrapperCol={{span: 24}}
                            hasFeedback
                            help={isFieldValidating('telephone') ? '校验中...' : (getFieldError('telephone') || []).join(', ')}
                            required>
                            <Input id="account" {...accountProps} placeholder="输入需要修改密码的手机号" onBlur={this::this.handleAccountInputBlur} onFocus={this::this.handleAccountInputFocus} disabled={this.state.AccountIsDisabled}/>
                        </FormItem>
                        <FormItem
                            label=""
                            labelCol={{span: 0}}
                            wrapperCol={{span: 24}}
                            hasFeedback
                            help={isFieldValidating('oldPassword') ? '校验中...' : (getFieldError('oldPassword') || []).join(', ')}
                            required>
                            <Input {...oldPasswordProps} maxLength="18" type="password" onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} autoComplete="off" placeholder="请输入原密码"/>
                        </FormItem>
                        <FormItem
                            label=""
                            labelCol={{span: 0}}
                            wrapperCol={{span: 24}}
                            hasFeedback
                            help={isFieldValidating('newPassword') ? '校验中...' : (getFieldError('ewPassword') || []).join(', ')}
                            required>
                            <Input {...newPasswordProps} maxLength="18" type="password" onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} autoComplete="off" placeholder="请输入新密码"/>
                        </FormItem>
                        <FormItem
                            label=""
                            id="rePassword"
                            labelCol={{span: 0}}
                            wrapperCol={{span: 24}}
                            hasFeedback
                            help={isFieldValidating('reNewPassword') ? '校验中...' : (getFieldError('reNewPassword') || []).join(', ')}
                            required>
                            <Input {...reNewPasswordProps} maxLength="18" type="password" onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} autoComplete="off" placeholder="两次输入密码保持一致"/>
                        </FormItem>
                        <Button type="primary" onClick={this::this.submitModify} style={{marginBottom: 15, width: 280}}>确认修改</Button>
                        <Button onClick={this::this.returnLogin} style={{width: 280}}>返回登录</Button>
                    </Spin>
                </Form>
                <ForgetPassword sendAccount={this.props.form.getFieldValue('account')} isShowRegister={this.state.isShowRegister}/>
            </div>
        );
    }
}

FindPsw = createForm()(FindPsw);

export default FindPsw;
